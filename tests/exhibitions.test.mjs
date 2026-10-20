import test from "node:test";
import assert from "node:assert/strict";
import { exhibitionAnimalPath, exhibitionContactUrl, exhibitionDate, exhibitionUrl, exhibitionVideoEmbed, featuredExhibition, parseExhibitions, publicExhibitionContent, publicExhibitionImageKeys, publishedExhibitions, validateExhibitions } from "../lib/exhibitions.ts";

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
