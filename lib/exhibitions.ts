export type ExhibitionAnimal = {
  id?: number; name: string; rp: string; breed: string; image: string;
  status: "published" | "draft"; sold: boolean; catalogSection?: "genetics" | "criollos";
  registration?: string | null; birthDate?: string | null;
  pedigree?: ExhibitionPedigreeMember[]; deps?: ExhibitionDep[];
};
export type ExhibitionPedigreeMember = { relation: string; name: string; registration?: string | null };
export type ExhibitionDep = { label: string; value: string; precision?: string | null; percentile?: string | null };
export type ExhibitionGenetics = {
  registration: string; birthDate: string; evaluationDate: string;
  showPedigree: boolean; showDeps: boolean;
  pedigreeSource: "catalog" | "manual"; depsSource: "catalog" | "manual";
  pedigree: ExhibitionPedigreeMember[]; deps: ExhibitionDep[];
};
export type ExhibitionResult = {
  id: string; animalId: number | null; name: string; rp: string; breed: string;
  award: string; category: string; notes: string; champion: boolean;
  imageKey: string; semen: boolean; semenUrl: string; embryos: boolean; embryosUrl: string; provider: string;
} & ExhibitionGenetics;
export type ExhibitionPhoto = { id: string; imageKey: string; caption: string; date: string };
export type ExhibitionVideo = { id: string; url: string; caption: string };
export type Exhibition = {
  id: string; slug: string; name: string; year: string; date: string; location: string;
  summary: string; story: string; imageKey: string; published: boolean;
  results: ExhibitionResult[]; photos: ExhibitionPhoto[]; videos: ExhibitionVideo[];
};

type Content = Record<string, string>;
const string = (value: unknown, max = 300) => typeof value === "string" ? value.trim().slice(0, max) : "";
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const imageKey = (value: unknown) => /^[a-z0-9-]{1,120}$/.test(string(value)) ? string(value) : "";
const id = (value: unknown) => /^[a-zA-Z0-9_-]{1,80}$/.test(string(value)) ? string(value) : "";
const geneticValue = (value: unknown) => string(typeof value === "number" && Number.isFinite(value) ? String(value) : value);
const hasGeneticValue = (value: string) => Boolean(value && !/^(?:-|—|n\/a|sin dato|sin cargar)$/i.test(value));

export const exhibitionPedigreeRelations = [
  ["sire", "Padre"], ["dam", "Madre"],
  ["paternal_grandsire", "Abuelo paterno"], ["paternal_granddam", "Abuela paterna"],
  ["maternal_grandsire", "Abuelo materno"], ["maternal_granddam", "Abuela materna"],
] as const;

export function emptyExhibitionGenetics(): ExhibitionGenetics {
  return { registration: "", birthDate: "", evaluationDate: "", showPedigree: true, showDeps: true, pedigreeSource: "manual", depsSource: "manual", pedigree: [], deps: [] };
}

function normalizePedigree(value: unknown): ExhibitionPedigreeMember[] {
  return exhibitionPedigreeRelations.flatMap(([relation]) => {
    const member = list(value).map(record).find(item => item.relation === relation);
    return member ? [{ relation, name: string(member.name), registration: geneticValue(member.registration) }] : [];
  });
}

function normalizeDeps(value: unknown): ExhibitionDep[] {
  return list(value).slice(0, 40).map(record).map(dep => ({
    label: string(dep.label), value: geneticValue(dep.value), precision: geneticValue(dep.precision), percentile: geneticValue(dep.percentile),
  }));
}

// Catalog data is current; manual data is an independent historical snapshot.
export function exhibitionCatalogGenetics(animal?: ExhibitionAnimal) {
  return {
    registration: geneticValue(animal?.registration), birthDate: exhibitionDate(string(animal?.birthDate)),
    pedigree: normalizePedigree(animal?.pedigree), deps: normalizeDeps(animal?.deps),
  };
}

export function resolveExhibitionGenetics(result: ExhibitionResult, animal?: ExhibitionAnimal) {
  const linked = animal?.id === result.animalId && animal?.status === "published" ? animal : undefined;
  const catalog = exhibitionCatalogGenetics(linked);
  return {
    registration: result.registration || catalog.registration, birthDate: result.birthDate || catalog.birthDate,
    evaluationDate: result.depsSource === "manual" ? result.evaluationDate : "",
    pedigree: result.showPedigree === false ? [] : (result.pedigreeSource === "manual" ? result.pedigree : catalog.pedigree).filter(member => hasGeneticValue(member.name)),
    deps: result.showDeps === false ? [] : (result.depsSource === "manual" ? result.deps : catalog.deps).filter(dep => hasGeneticValue(dep.label) && hasGeneticValue(dep.value)),
  };
}

export function exhibitionPedigreeBranches(pedigree: ExhibitionPedigreeMember[]) {
  return ([
    { relation: "sire", label: "Padre", grandparents: ["paternal_grandsire", "paternal_granddam"] },
    { relation: "dam", label: "Madre", grandparents: ["maternal_grandsire", "maternal_granddam"] },
  ] as const).map(branch => ({
    ...branch, parent: pedigree.find(member => member.relation === branch.relation && hasGeneticValue(member.name)),
    ancestors: branch.grandparents.flatMap(relation => {
      const member = pedigree.find(item => item.relation === relation && hasGeneticValue(item.name));
      return member ? [{ ...member, label: exhibitionPedigreeRelations.find(([key]) => key === relation)![1] }] : [];
    }),
  })).filter(branch => branch.parent || branch.ancestors.length);
}

export function exhibitionUrl(value: unknown): string {
  const raw = string(value, 2000);
  if (!raw || (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw))) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.toString() : "";
  } catch { return ""; }
}

export function exhibitionDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return "";
  return value;
}

export const exhibitionSlug = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);

export function parseExhibitions(raw?: string): Exhibition[] {
  try {
    return list(JSON.parse(raw || "[]")).slice(0, 100).map(item => {
      const event = record(item);
      return {
        id: id(event.id), slug: exhibitionSlug(string(event.slug)), name: string(event.name),
        year: /^\d{4}$/.test(string(event.year)) ? string(event.year) : "", date: exhibitionDate(string(event.date)),
        location: string(event.location), summary: string(event.summary, 1000), story: string(event.story, 12000),
        imageKey: imageKey(event.imageKey), published: event.published === true,
        results: list(event.results).slice(0, 100).map(value => {
          const r = record(value);
          return {
            id: id(r.id), animalId: Number.isSafeInteger(r.animalId) && Number(r.animalId) > 0 ? Number(r.animalId) : null,
            name: string(r.name), rp: string(r.rp), breed: string(r.breed), award: string(r.award), category: string(r.category),
            notes: string(r.notes, 2000), champion: r.champion === true, imageKey: imageKey(r.imageKey),
            semen: r.semen === true, semenUrl: exhibitionUrl(r.semenUrl), embryos: r.embryos === true,
            embryosUrl: exhibitionUrl(r.embryosUrl), provider: string(r.provider),
            registration: geneticValue(r.registration), birthDate: exhibitionDate(string(r.birthDate)), evaluationDate: exhibitionDate(string(r.evaluationDate)),
            showPedigree: r.showPedigree !== false, showDeps: r.showDeps !== false,
            pedigreeSource: r.pedigreeSource === "manual" || !r.animalId ? "manual" as const : "catalog" as const,
            depsSource: r.depsSource === "manual" || !r.animalId ? "manual" as const : "catalog" as const,
            pedigree: normalizePedigree(r.pedigree), deps: normalizeDeps(r.deps),
          };
        }),
        photos: list(event.photos).slice(0, 60).map(value => {
          const p = record(value);
          return { id: id(p.id), imageKey: imageKey(p.imageKey), caption: string(p.caption), date: exhibitionDate(string(p.date)) };
        }),
        videos: list(event.videos).slice(0, 15).map(value => {
          const v = record(value);
          return { id: id(v.id), url: exhibitionUrl(v.url), caption: string(v.caption) };
        }),
      };
    }).filter(event => event.id && event.slug && event.name);
  } catch { return []; }
}

export function validateExhibitions(raw: string): Exhibition[] {
  if (raw.length > 600_000) throw new Error("Las exposiciones superan el tamaño permitido. Reducí el texto o la cantidad de registros.");
  let source: unknown;
  try { source = JSON.parse(raw); } catch { throw new Error("Los datos de las exposiciones no son válidos."); }
  if (!Array.isArray(source) || source.length > 100) throw new Error("Podés guardar hasta 100 participaciones.");
  const events = parseExhibitions(raw);
  if (events.length !== source.length) throw new Error("Cada exposición necesita nombre, identificador y dirección válidos.");
  if (new Set(events.map(e => e.id)).size !== events.length || new Set(events.map(e => e.slug)).size !== events.length) throw new Error("Cada exposición debe tener una dirección diferente.");
  for (const event of events) {
    if (!event.year || +event.year < 1900 || +event.year > 2200) throw new Error(`Indicá un año válido para ${event.name}.`);
    if (event.date && !event.date.startsWith(event.year)) throw new Error(`La fecha de ${event.name} debe coincidir con su año.`);
    if (event.results.some(r => !r.id || !r.name)) throw new Error("Cada resultado necesita el nombre del animal.");
    if (new Set(event.results.map(r => r.id)).size !== event.results.length) throw new Error("Hay resultados repetidos en una exposición.");
    const original = record(source.find(value => record(value).id === event.id));
    if (list(original.results).length > 100 || list(original.photos).length > 60 || list(original.videos).length > 15) throw new Error("Una participación admite hasta 100 animales, 60 fotos y 15 videos.");
    if (string(original.date) && !exhibitionDate(string(original.date))) throw new Error(`Revisá la fecha de ${event.name}.`);
    if (event.results.some(r => r.champion && !r.award)) throw new Error("Indicá el premio de los reconocimientos destacados.");
    if (event.photos.some(p => !p.id) || event.videos.some(v => !v.id)) throw new Error("Cada imagen o video necesita un identificador válido.");
    if (list(original.photos).some(p => string(record(p).date) && !exhibitionDate(string(record(p).date)))) throw new Error("Revisá las fechas de las fotografías.");
    for (const value of list(original.results)) {
      const r = record(value);
      if (list(r.pedigree).length > 6 || list(r.deps).length > 40) throw new Error("Cada animal admite hasta seis ascendientes y 40 DEPs.");
      const relations = list(r.pedigree).map(member => record(member).relation);
      if (new Set(relations).size !== relations.length || relations.some(relation => !exhibitionPedigreeRelations.some(([key]) => key === relation))) throw new Error("Revisá las relaciones del pedigree: no pueden repetirse ni usar relaciones desconocidas.");
      for (const key of ["birthDate", "evaluationDate"]) if (string(r[key]) && !exhibitionDate(string(r[key]))) throw new Error("Revisá la fecha de nacimiento o de evaluación genética del animal.");
      for (const key of ["semenUrl", "embryosUrl"]) if (string(r[key]) && !exhibitionUrl(r[key])) throw new Error("Los enlaces de semen y embriones deben ser direcciones web válidas.");
    }
    if (list(original.videos).some(v => !exhibitionUrl(record(v).url))) throw new Error("Revisá los enlaces de video.");
  }
  return events;
}

export function publishedExhibitions(content: Content): Exhibition[] {
  if (content.show_exhibitions === "false") return [];
  return parseExhibitions(content.exhibitions_json).filter(e => e.published).sort((a, b) => b.year.localeCompare(a.year) || b.date.localeCompare(a.date));
}

export function publicExhibitionContent(content: Content): Content {
  if (!("exhibitions_json" in content)) return content;
  return { ...content, exhibitions_json: JSON.stringify(parseExhibitions(content.exhibitions_json).filter(e => e.published)) };
}

export function publicExhibitionImageKeys(content: Content) {
  return new Set(parseExhibitions(content.exhibitions_json).filter(e => e.published).flatMap(e => [e.imageKey, ...e.results.map(r => r.imageKey), ...e.photos.map(p => p.imageKey)]).filter(Boolean));
}

export function featuredExhibition(content: Content) {
  if (content.show_home_exhibitions !== "true") return null;
  const event = publishedExhibitions(content).find(e => e.id === content.exhibitions_home_event);
  if (!event) return null;
  const result = event.results.find(r => r.id === content.exhibitions_home_result);
  return { event, result };
}

export function exhibitionAnimalPath(animal: ExhibitionAnimal) {
  if (!animal.id || animal.status !== "published") return "";
  return `/${animal.catalogSection === "criollos" ? "criollos" : "genetica"}/${animal.id}-${exhibitionSlug(animal.name)}`;
}

export function exhibitionResultPath(event: Pick<Exhibition, "slug">, result: Pick<ExhibitionResult, "id">, preview = false) {
  return `/exposiciones/${encodeURIComponent(event.slug)}/animales/${encodeURIComponent(result.id)}${preview ? "?preview=1" : ""}`;
}

export function exhibitionContactUrl(content: Content, result: ExhibitionResult, kind: "semen" | "embryos") {
  if (!result[kind]) return "";
  const custom = exhibitionUrl(kind === "semen" ? result.semenUrl : result.embryosUrl);
  if (custom) return custom;
  const whatsapp = content.contact_whatsapp?.trim() || "";
  const url = exhibitionUrl(whatsapp);
  let phone = "";
  if (url) {
    const parsed = new URL(url);
    if (parsed.hostname === "wa.me") phone = parsed.pathname.replace(/\D/g, "");
    if (parsed.hostname === "api.whatsapp.com" || parsed.hostname === "web.whatsapp.com") phone = parsed.searchParams.get("phone")?.replace(/\D/g, "") || "";
  } else if (/^[+\d\s()-]+$/.test(whatsapp)) phone = whatsapp.replace(/\D/g, "");
  if (!phone) phone = (content.contact_phone || "").replace(/\D/g, "");
  if (!phone) return "";
  const message = `Hola, quisiera consultar por ${kind === "semen" ? "semen" : "embriones"} de ${result.name}${result.rp ? ` (RP ${result.rp})` : ""}, que vi en la sección de exposiciones.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function exhibitionVideoEmbed(value: string) {
  const safe = exhibitionUrl(value);
  if (!safe) return "";
  const url = new URL(safe);
  const host = url.hostname.replace(/^www\./, "");
  const key = host === "youtu.be" ? url.pathname.slice(1) : ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host) ? url.searchParams.get("v") || url.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/)?.[1] : "";
  return key && /^[\w-]{11}$/.test(key) ? `https://www.youtube-nocookie.com/embed/${key}` : "";
}
