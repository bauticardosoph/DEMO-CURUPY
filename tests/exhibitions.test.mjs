import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { exhibitionAnimalPath, exhibitionContactUrl, exhibitionDate, exhibitionUrl, exhibitionVideoEmbed, exhibitionCatalogGenetics, exhibitionPedigreeBranches, featuredExhibition, parseExhibitions, publicExhibitionContent, publicExhibitionImageKeys, publishedExhibitions, resolveExhibitionGenetics, validateExhibitions } from "../lib/exhibitions.ts";

const result = { id: "winner-1", animalId: 12, name: "Animal de prueba", rp: "100", breed: "Hereford", award: "Gran Campeón", category: "Senior", notes: "", champion: true, imageKey: "expo-winner", semen: true, semenUrl: "", embryos: true, embryosUrl: "https://example.com/embriones", provider: "" };
const event = { id: "show-1", slug: "exposicion-2026", name: "Exposición de prueba", year: "2026", date: "2026-09-15", location: "Uruguay", summary: "Participación de prueba", story: "", imageKey: "expo-cover", published: true, results: [result], photos: [], videos: [] };
const content = { exhibitions_json: JSON.stringify([event, { ...event, id: "draft-1", slug: "borrador", name: "Solo administrador", published: false, imageKey: "expo-draft", results: [] }]), contact_whatsapp: "https://wa.me/59891088716" };

test("public data excludes unpublished events and their image keys", () => {
  const publicContent = publicExhibitionContent(content);
  assert.deepEqual(parseExhibitions(publicContent.exhibitions_json).map(e => e.id), ["show-1"]);
  assert.deepEqual([...publicExhibitionImageKeys(content)], ["expo-cover", "expo-winner"]);
  assert.equal(publishedExhibitions({ ...content, show_exhibitions: "false" }).length, 0);
  assert.deepEqual(parseExhibitions("bad json"), []);
});
test("home highlight must point to a published event and respects visibility", () => {
  const config = { ...content, show_home_exhibitions: "true", exhibitions_home_event: "show-1", exhibitions_home_result: "winner-1" };
  assert.equal(featuredExhibition(config)?.result?.award, "Gran Campeón");
  assert.equal(featuredExhibition({ ...config, exhibitions_home_event: "draft-1" }), null);
  assert.equal(featuredExhibition({ ...config, show_exhibitions: "false" }), null);
  assert.equal(featuredExhibition({ ...config, show_home_exhibitions: "false" }), null);
});
test("commercial links stay available for a sold animal and do not link to a draft animal", () => {
  const animal = { id: 12, name: "Animal de prueba", status: "published", catalogSection: "genetics", sold: true };
  assert.equal(exhibitionAnimalPath(animal), "/genetica/12-animal-de-prueba");
  assert.equal(exhibitionAnimalPath({ ...animal, status: "draft" }), "");
  assert.match(exhibitionContactUrl(content, result, "semen"), /^https:\/\/wa.me\/59891088716\?text=/);
  assert.match(decodeURIComponent(exhibitionContactUrl(content, result, "semen")), /semen de Animal de prueba \(RP 100\)/);
  assert.equal(exhibitionContactUrl(content, result, "embryos"), "https://example.com/embriones");
  assert.equal(exhibitionContactUrl({}, result, "semen"), "");
  assert.equal(exhibitionContactUrl(content, { ...result, semen: false }, "semen"), "");
});
test("stored data rejects duplicate routes, missing names and invalid dates", () => {
  assert.equal(validateExhibitions(JSON.stringify([event])).length, 1);
  assert.throws(() => validateExhibitions(JSON.stringify([event, { ...event, id: "another" }])));
  assert.throws(() => validateExhibitions(JSON.stringify([{ ...event, date: "2026-02-30" }])));
  assert.throws(() => validateExhibitions(JSON.stringify([{ ...event, year: "2025" }])));
  assert.throws(() => validateExhibitions(JSON.stringify([{ ...event, results: [{ ...result, name: "" }] }])));
  assert.throws(() => validateExhibitions(JSON.stringify([{ ...event, results: [{ ...result, semenUrl: "javascript:alert(1)" }] }])));
  assert.equal(exhibitionDate("2024-02-29"), "2024-02-29");
});
test("videos embed only trusted YouTube hosts and external links reject active schemes", () => {
  assert.equal(exhibitionVideoEmbed("https://youtu.be/TC9cYaiATFA"), "https://www.youtube-nocookie.com/embed/TC9cYaiATFA");
  assert.equal(exhibitionVideoEmbed("https://youtube.com.evil.test/watch?v=TC9cYaiATFA"), "");
  assert.equal(exhibitionUrl("javascript:alert(1)"), "");
  assert.equal(exhibitionUrl("data:text/html,test"), "");
  assert.equal(exhibitionUrl("https://user:password@example.com"), "");
});

const animal = {
  id: 12, name: "Animal de prueba", status: "published", registration: "234238", birthDate: "2024-09-11",
  pedigree: [
    { relation: "sire", name: "Padre", registration: "100" },
    { relation: "dam", name: "Madre" },
    { relation: "paternal_grandsire", name: "Abuelo paterno" },
    { relation: "paternal_granddam", name: "Abuela paterna" },
    { relation: "maternal_grandsire", name: "Abuelo materno" },
    { relation: "maternal_granddam", name: "Abuela materna" },
  ],
  deps: [{ label: "Peso al nacer", value: "0", precision: "0.42", percentile: "5" }, { label: "Sin dato", value: "" }],
};
const normalizedResult = (extra = {}) => validateExhibitions(JSON.stringify([{ ...event, results: [{ ...result, ...extra }] }]))[0].results[0];

test("existing linked results inherit published catalog genetics without another query", () => {
  const row = normalizedResult();
  assert.equal(row.pedigreeSource, "catalog");
  assert.equal(row.showDeps, true);
  const genetics = resolveExhibitionGenetics(row, animal);
  assert.equal(genetics.registration, "234238");
  assert.equal(genetics.birthDate, "2024-09-11");
  assert.equal(genetics.pedigree.length, 6);
  assert.equal(genetics.deps.length, 1);
  assert.equal(genetics.deps[0].value, "0");
  assert.equal(resolveExhibitionGenetics(row, { ...animal, status: "draft" }).deps.length, 0);
  assert.equal(resolveExhibitionGenetics(row, { ...animal, id: 99 }).pedigree.length, 0);
  assert.equal(resolveExhibitionGenetics(row).registration, "");
});

test("independent exhibition snapshots roundtrip, preserve zero and hide incomplete data", () => {
  const snapshot = exhibitionCatalogGenetics(animal);
  const row = normalizedResult({ ...snapshot, animalId: null, pedigreeSource: "manual", depsSource: "manual", evaluationDate: "2026-10-20",
    deps: [...snapshot.deps, { label: "Cero numérico", value: 0, precision: 0 }, { label: "", value: "3" }, { label: "Ausente", value: "—" }],
  });
  const restored = normalizedResult(JSON.parse(JSON.stringify(row)));
  assert.deepEqual(restored, row);
  const genetics = resolveExhibitionGenetics(restored, { ...animal, deps: [{ label: "Nuevo DEP", value: "88" }] });
  assert.equal(genetics.deps.length, 2);
  assert.equal(genetics.deps[0].value, "0");
  assert.equal(genetics.deps[1].precision, "0");
  assert.equal(genetics.evaluationDate, "2026-10-20");
  assert.equal(genetics.pedigree[0].name, "Padre");
  assert.equal(genetics.registration, "234238");
});

test("pedigree and DEPs can be hidden independently without erasing their values", () => {
  const snapshot = exhibitionCatalogGenetics(animal);
  const hidden = normalizedResult({ ...snapshot, pedigreeSource: "manual", depsSource: "manual", showDeps: false });
  assert.equal(hidden.deps.length, 2);
  assert.equal(resolveExhibitionGenetics(hidden).deps.length, 0);
  assert.equal(resolveExhibitionGenetics(hidden).pedigree.length, 6);
  assert.equal(resolveExhibitionGenetics({ ...hidden, showPedigree: false }).pedigree.length, 0);
  assert.equal(resolveExhibitionGenetics({ ...hidden, showDeps: true }).deps.length, 1);
  assert.equal(resolveExhibitionGenetics(normalizedResult({ ...snapshot, depsSource: "catalog", evaluationDate: "2020-01-01" }), animal).evaluationDate, "");
});

test("maternal ancestors never join the paternal branch, even with missing parents", () => {
  const branches = exhibitionPedigreeBranches(animal.pedigree);
  assert.deepEqual(branches[0].ancestors.map(m => m.relation), ["paternal_grandsire", "paternal_granddam"]);
  assert.deepEqual(branches[1].ancestors.map(m => m.relation), ["maternal_grandsire", "maternal_granddam"]);
  const sparse = exhibitionPedigreeBranches([{ relation: "sire", name: "Padre" }, { relation: "maternal_grandsire", name: "Abuelo materno" }]);
  assert.equal(sparse[0].ancestors.length, 0);
  assert.equal(sparse[1].parent, undefined);
  assert.equal(sparse[1].ancestors[0].label, "Abuelo materno");
});

test("invalid genetic dates, duplicate relatives and oversized DEPs fail validation", () => {
  assert.throws(() => normalizedResult({ evaluationDate: "2026-02-30" }));
  assert.throws(() => normalizedResult({ birthDate: "2025-02-29" }));
  assert.throws(() => normalizedResult({ pedigree: [animal.pedigree[0], animal.pedigree[0]] }));
  assert.throws(() => normalizedResult({ pedigree: [{ relation: "unknown", name: "Incorrecto" }] }));
  assert.throws(() => normalizedResult({ deps: Array.from({ length: 41 }, () => animal.deps[0]) }));
  assert.throws(() => normalizedResult({ pedigree: Array.from({ length: 7 }, () => animal.pedigree[0]) }));
});

test("exhibition animal URLs are stable, scoped to their event and preserve authenticated preview", async () => {
  const { exhibitionResultPath } = await import("../lib/exhibitions.ts");
  assert.equal(exhibitionResultPath(event, result), "/exposiciones/exposicion-2026/animales/winner-1");
  assert.equal(exhibitionResultPath(event, { ...result, name: "Nuevo nombre" }), exhibitionResultPath(event, result));
  assert.equal(exhibitionResultPath(event, result, true), "/exposiciones/exposicion-2026/animales/winner-1?preview=1");
  assert.notEqual(exhibitionResultPath({ ...event, slug: "otra-exposicion" }, result), exhibitionResultPath(event, result));
});

test("cards open a dedicated animal page instead of squeezing the pedigree into the grid", () => {
  const source = readFileSync(new URL("../app/exhibitions.tsx", import.meta.url), "utf8");
  const cards = source.slice(source.indexOf("function ResultCard("), source.indexOf("function ExhibitionAnimalDetail("));
  const detail = source.slice(source.indexOf("function ExhibitionAnimalDetail("), source.indexOf("export function ExhibitionsView("));
  assert.doesNotMatch(cards, /<ExhibitionGeneticsView/);
  assert.match(cards, /exhibitionResultPath\(event, result, preview\)/);
  assert.match(cards, /Ver animal/);
  assert.match(detail, /<ExhibitionGeneticsView/);
  assert.match(detail, /Volver a/);
  const route = readFileSync(new URL("../app/exposiciones/[slug]/animales/[resultId]/page.tsx", import.meta.url), "utf8");
  assert.match(route, /requireAdminUser\(exhibitionResultPath/);
  assert.match(route, /event\?\.results\.some\(result => result.id === resultId\)/);
  assert.match(route, /notFound\(\)/);
  assert.match(route, /canonical: exhibitionResultPath/);
});
