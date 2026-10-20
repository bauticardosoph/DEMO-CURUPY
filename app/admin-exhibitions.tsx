"use client";

import { useState } from "react";
import { readApiJson, uploadImageDirect } from "../lib/client-upload";
import { emptyExhibitionGenetics, exhibitionSlug, parseExhibitions, validateExhibitions, type Exhibition, type ExhibitionAnimal, type ExhibitionPhoto, type ExhibitionResult } from "../lib/exhibitions";
import { ExhibitionGeneticsEditor } from "./admin-exhibition-genetics";
import "./exhibitions.css";

type Content = Record<string, string>;
type SiteImage = { imageKey: string; label: string; url: string; fallbackUrl: string; storageKey?: string | null };
type Props = { content: Content; images: Content; animals: ExhibitionAnimal[]; updateContent: (values: Content) => void; updateSiteImage: (image: SiteImage) => void };
const newId = () => crypto.randomUUID();
const newEvent = (): Exhibition => ({ id: newId(), slug: "", name: "", year: String(new Date().getFullYear()), date: "", location: "", summary: "", story: "", imageKey: "", published: false, results: [], photos: [], videos: [] });
const newResult = (): ExhibitionResult => ({ ...emptyExhibitionGenetics(), id: newId(), animalId: null, name: "", rp: "", breed: "", award: "", category: "", notes: "", champion: false, imageKey: "", semen: false, semenUrl: "", embryos: false, embryosUrl: "", provider: "" });

function ExhibitionImage({ label, imageKey, images, change, updateSiteImage, busyChange }: { label: string; imageKey: string; images: Content; change: (key: string) => void; updateSiteImage: Props["updateSiteImage"]; busyChange: (busy: boolean) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true); busyChange(true); setError("");
    try {
      const key = imageKey || `expo-${newId()}`;
      const result = await uploadImageDirect<{ image?: SiteImage; error?: string }>("/api/site-images", file, { imageKey: key, label });
      if (!result.image) throw new Error("La imagen no terminó de registrarse.");
      updateSiteImage(result.image); change(key);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo subir la imagen."); }
    finally { setBusy(false); busyChange(false); }
  };
  return <div className="expoImageInput">
    {images[imageKey] && <img src={images[imageKey]} alt={label} />}
    <label>{label}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }} /></label>
    {busy && <small role="status">Subiendo fotografía…</small>}
    {imageKey && <button type="button" disabled={busy} onClick={() => change("")}>Quitar imagen de esta participación</button>}
    {error && <p role="alert" className="accountError">{error}</p>}
  </div>;
}

export default function AdminExhibitions({ content, images, animals, updateContent, updateSiteImage }: Props) {
  const events = parseExhibitions(content.exhibitions_json);
  const [editor, setEditor] = useState<Exhibition | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState(() => ({
    show_exhibitions: content.show_exhibitions || "true", exhibitions_eyebrow: content.exhibitions_eyebrow || "Exposiciones y reconocimientos",
    exhibitions_title: content.exhibitions_title || "Nuestro paso por las pistas.", exhibitions_intro: content.exhibitions_intro || "",
    show_home_exhibitions: content.show_home_exhibitions || "false", exhibitions_home_event: content.exhibitions_home_event || "",
    exhibitions_home_result: content.exhibitions_home_result || "", exhibitions_home_position: content.exhibitions_home_position || "before_auction",
    exhibitions_home_eyebrow: content.exhibitions_home_eyebrow || "En las pistas",
  }));
  const changeSettings = (key: keyof typeof settings, value: string) => setSettings(current => ({ ...current, [key]: value }));
  const edit = (value: Partial<Exhibition>) => setEditor(current => current ? { ...current, ...value } : current);
  const editResult = (resultId: string, value: Partial<ExhibitionResult>) => setEditor(current => current ? { ...current, results: current.results.map(r => r.id === resultId ? { ...r, ...value } : r) } : current);
  const editPhoto = (photoId: string, value: Partial<ExhibitionPhoto>) => setEditor(current => current ? { ...current, photos: current.photos.map(p => p.id === photoId ? { ...p, ...value } : p) } : current);
  const busyChange = (uploading: boolean) => setUploads(current => Math.max(0, current + (uploading ? 1 : -1)));
  const save = async (values: Content) => {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/site-content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values }) });
      const result = await readApiJson<{ content?: Content; error?: string }>(response);
      if (!response.ok || !result.content) throw new Error(result.error || "No se pudieron guardar las exposiciones.");
      updateContent(result.content); setMessage("Guardado. Usá ‘Publicar cambios’ para actualizar la web."); return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar."); return false; }
    finally { setBusy(false); }
  };
  const saveEvent = async () => {
    if (!editor) return;
    try {
      const next = events.some(e => e.id === editor.id) ? events.map(e => e.id === editor.id ? editor : e) : [editor, ...events];
      const normalized = validateExhibitions(JSON.stringify(next));
      if (await save({ exhibitions_json: JSON.stringify(normalized) })) setEditor(null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Revisá los datos de la exposición."); }
  };
  const remove = async (event: Exhibition) => {
    if (!window.confirm(`¿Quitar ${event.name}? El cambio se aplicará a la web cuando publiques.`)) return;
    await save({ exhibitions_json: JSON.stringify(events.filter(e => e.id !== event.id)) });
  };
  const selectedEvent = events.find(e => e.id === settings.exhibitions_home_event);
  const shiftResult = (index: number, direction: number) => {
    if (!editor || index + direction < 0 || index + direction >= editor.results.length) return;
    const next = [...editor.results]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; edit({ results: next });
  };
  return <>
    <section className="adminPageHead"><div><p>Trayectoria de la cabaña</p><h1>Exposiciones</h1><span>Participaciones, premios y genética disponible.</span></div><button disabled={busy || uploads > 0} onClick={() => { setEditor(newEvent()); setError(""); setMessage(""); }}>＋ Nueva participación</button></section>
    {message && <p className="accountSuccess" role="status">{message}</p>}{error && <p className="accountError" role="alert">{error}</p>}
    {editor ? <form className="adminPanel expoEditor" onSubmit={e => { e.preventDefault(); void saveEvent(); }}>
      <header><div><h2>{editor.name || "Nueva participación"}</h2><p>Guardá la participación y después publicá los cambios del sitio.</p></div><button type="button" disabled={uploads > 0 || busy} onClick={() => setEditor(null)}>Cerrar</button></header>
      <div className="expoForm">
        <div className="expoFields"><label>Nombre de la exposición<input required maxLength={300} value={editor.name} onChange={e => { const name = e.target.value; edit({ name, ...(!events.some(event => event.id === editor.id) ? { slug: exhibitionSlug(`${name}-${editor.year}`) } : {}) }); }} placeholder="Ej. Expo Prado" /></label><label>Año<input type="number" min="1900" max="2200" required value={editor.year} onChange={e => edit({ year: e.target.value })} /></label><label>Fecha de participación<input type="date" value={editor.date} onChange={e => edit({ date: e.target.value, ...(e.target.value ? { year: e.target.value.slice(0, 4) } : {}) })} /></label><label>Lugar<input value={editor.location} onChange={e => edit({ location: e.target.value })} placeholder="Predio, localidad o departamento" /></label><label className="expoFull">Dirección de la página<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={editor.slug} onChange={e => edit({ slug: e.target.value })} /><small>/exposiciones/{editor.slug || "nombre-de-la-exposicion"}. Conservá esta dirección si ya la compartiste.</small></label><label className="expoFull">Presentación breve<textarea rows={3} maxLength={1000} value={editor.summary} onChange={e => edit({ summary: e.target.value })} /></label><label className="expoFull">Historia de la participación<textarea rows={6} maxLength={12000} value={editor.story} onChange={e => edit({ story: e.target.value })} placeholder="Separá los párrafos con una línea en blanco." /></label></div>
        <ExhibitionImage label="Portada de la exposición" imageKey={editor.imageKey} images={images} change={imageKey => edit({ imageKey })} updateSiteImage={updateSiteImage} busyChange={busyChange} />
        <label className="expoCheck"><input type="checkbox" checked={editor.published} onChange={e => edit({ published: e.target.checked })} /> Mostrar esta participación al publicar cambios</label>
        <section className="expoEditorSection"><header><div><h3>Animales y resultados</h3><p>Vinculá una ficha existente o registrá un animal que todavía no está en el catálogo. El premio es opcional.</p></div><button type="button" onClick={() => edit({ results: [...editor.results, newResult()] })}>＋ Agregar animal</button></header>
          <datalist id="exhibition-awards">{["Gran Campeón", "Gran Campeona", "Reservado Gran Campeón", "Reservada Gran Campeona", "Tercer Mejor Macho", "Tercera Mejor Hembra", "Campeón de categoría", "Primer premio"].map(award => <option key={award} value={award} />)}</datalist>
          {editor.results.map((result, index) => <article key={result.id} className="expoResultEditor"><header><h4>{result.name || `Animal ${index + 1}`}</h4><div><button type="button" aria-label={`Subir ${result.name || "animal"}`} disabled={index === 0} onClick={() => shiftResult(index, -1)}>↑</button><button type="button" aria-label={`Bajar ${result.name || "animal"}`} disabled={index === editor.results.length - 1} onClick={() => shiftResult(index, 1)}>↓</button><button type="button" onClick={() => edit({ results: editor.results.filter(r => r.id !== result.id) })}>Quitar</button></div></header>
            <div className="expoFields"><label className="expoFull">Vincular con el catálogo<select value={result.animalId || ""} onChange={e => { const animal = animals.find(a => a.id === Number(e.target.value)); editResult(result.id, animal ? { animalId: animal.id || null, name: animal.name, rp: animal.rp, breed: animal.breed, ...(!result.pedigree.some(member => member.name.trim()) ? { pedigreeSource: "catalog" as const } : {}), ...(!result.deps.some(dep => dep.label.trim() && dep.value.trim()) ? { depsSource: "catalog" as const } : {}) } : { animalId: null, pedigreeSource: "manual" as const, depsSource: "manual" as const }); }}><option value="">Sin ficha vinculada</option>{animals.filter(a => a.id).map(a => <option key={a.id} value={a.id}>{a.name} · RP {a.rp}{a.catalogSection === "criollos" ? " · Criollos" : ""}{a.status === "draft" ? " · Borrador" : ""}</option>)}</select><small>El botón ‘Ver ficha’ solo aparece si el animal está publicado.</small></label><label>Nombre del animal<input required value={result.name} onChange={e => editResult(result.id, { name: e.target.value })} /></label><label>RP<input value={result.rp} onChange={e => editResult(result.id, { rp: e.target.value })} /></label><label>Raza<input value={result.breed} onChange={e => editResult(result.id, { breed: e.target.value })} /></label><label>Categoría en la exposición<input value={result.category} onChange={e => editResult(result.id, { category: e.target.value })} placeholder="Ej. Senior, Vaquillona o Potrillo" /></label><label className="expoFull">Premio o reconocimiento<input list="exhibition-awards" value={result.award} onChange={e => editResult(result.id, { award: e.target.value })} placeholder="Seleccioná una sugerencia o escribí el premio exacto" /></label><label className="expoFull">Descripción del resultado<textarea rows={2} value={result.notes} onChange={e => editResult(result.id, { notes: e.target.value })} /></label></div>
            <label className="expoCheck"><input type="checkbox" checked={result.champion} onChange={e => editResult(result.id, { champion: e.target.checked })} /> Dar protagonismo a este reconocimiento</label>
            <ExhibitionImage label="Fotografía en pista (opcional)" imageKey={result.imageKey} images={images} change={imageKey => editResult(result.id, { imageKey })} updateSiteImage={updateSiteImage} busyChange={busyChange} />
            <p className="expoHint">Si no cargás una fotografía, se usará la imagen de su ficha publicada.</p>
            <ExhibitionGeneticsEditor result={result} animal={animals.find(animal => animal.id === result.animalId)} change={values => editResult(result.id, values)} />
            <fieldset className="expoOffers"><legend>Disponibilidad genética</legend><p>Independiente de que el ejemplar esté vendido. Los enlaces pueden llevar a un centro genético o a WhatsApp.</p><label className="expoCheck"><input type="checkbox" checked={result.semen} onChange={e => editResult(result.id, { semen: e.target.checked })} /> Permitir consultas de semen</label>{result.semen && <label>Enlace de semen (opcional)<input type="url" value={result.semenUrl} placeholder="https://centro-genetico.com/animal" onChange={e => editResult(result.id, { semenUrl: e.target.value })} /></label>}<label className="expoCheck"><input type="checkbox" checked={result.embryos} onChange={e => editResult(result.id, { embryos: e.target.checked })} /> Permitir consultas de embriones</label>{result.embryos && <label>Enlace de embriones (opcional)<input type="url" value={result.embryosUrl} placeholder="https://centro-genetico.com/embriones" onChange={e => editResult(result.id, { embryosUrl: e.target.value })} /></label>}{(result.semen || result.embryos) && <><label>Nombre del centro o responsable (opcional)<input value={result.provider} onChange={e => editResult(result.id, { provider: e.target.value })} /></label><small>Sin enlace propio se usa el WhatsApp configurado en Página web → General. Si tampoco hay teléfono, el botón se oculta.</small></>}</fieldset>
          </article>)}
        </section>
        <section className="expoEditorSection"><header><div><h3>Galería de la participación</h3><p>Las imágenes y sus fechas son opcionales.</p></div><button type="button" onClick={() => edit({ photos: [...editor.photos, { id: newId(), imageKey: "", caption: "", date: "" }] })}>＋ Agregar foto</button></header><div className="expoPhotoEditors">{editor.photos.map(photo => <article key={photo.id}><ExhibitionImage label="Fotografía" imageKey={photo.imageKey} images={images} change={imageKey => editPhoto(photo.id, { imageKey })} updateSiteImage={updateSiteImage} busyChange={busyChange} /><label>Pie de foto<input value={photo.caption} onChange={e => editPhoto(photo.id, { caption: e.target.value })} /></label><label>Fecha de la fotografía<input type="date" value={photo.date} onChange={e => editPhoto(photo.id, { date: e.target.value })} /></label><button type="button" onClick={() => edit({ photos: editor.photos.filter(p => p.id !== photo.id) })}>Quitar fotografía de la galería</button></article>)}</div></section>
        <section className="expoEditorSection"><header><div><h3>Videos</h3><p>YouTube se reproduce dentro de la página. Otros enlaces se abren en su sitio.</p></div><button type="button" onClick={() => edit({ videos: [...editor.videos, { id: newId(), url: "", caption: "" }] })}>＋ Agregar video</button></header>{editor.videos.map(video => <div key={video.id} className="expoVideoEditor"><label>Enlace del video<input type="url" required value={video.url} onChange={e => edit({ videos: editor.videos.map(v => v.id === video.id ? { ...v, url: e.target.value } : v) })} /></label><label>Descripción<input value={video.caption} onChange={e => edit({ videos: editor.videos.map(v => v.id === video.id ? { ...v, caption: e.target.value } : v) })} /></label><button type="button" onClick={() => edit({ videos: editor.videos.filter(v => v.id !== video.id) })}>Quitar video</button></div>)}</section>
      </div>
      <footer><span>{uploads > 0 ? "Esperá a que terminen de subir las imágenes." : "Los campos vacíos no aparecen en la web."}</span><div><button type="button" disabled={busy || uploads > 0} onClick={() => setEditor(null)}>Cancelar</button><button type="submit" disabled={busy || uploads > 0}>{busy ? "Guardando…" : "Guardar participación"}</button></div></footer>
    </form> : <>
      <form className="adminPanel expoSettings" onSubmit={e => { e.preventDefault(); void save(settings); }}><header><h2>La sección y su destacado en Inicio</h2><button disabled={busy}>Guardar configuración</button></header><div className="expoFields"><label className="expoCheck expoFull"><input type="checkbox" checked={settings.show_exhibitions !== "false"} onChange={e => changeSettings("show_exhibitions", String(e.target.checked))} /> Mostrar Exposiciones en la web y el menú cuando haya participaciones publicadas</label><label>Antetítulo<input value={settings.exhibitions_eyebrow} onChange={e => changeSettings("exhibitions_eyebrow", e.target.value)} /></label><label>Título de la página<input required value={settings.exhibitions_title} onChange={e => changeSettings("exhibitions_title", e.target.value)} /></label><label className="expoFull">Introducción<textarea rows={3} value={settings.exhibitions_intro} onChange={e => changeSettings("exhibitions_intro", e.target.value)} /></label><label className="expoCheck expoFull"><input type="checkbox" checked={settings.show_home_exhibitions === "true"} onChange={e => changeSettings("show_home_exhibitions", String(e.target.checked))} /> Mostrar un destacado en Inicio</label>{settings.show_home_exhibitions === "true" && <><label>Participación a destacar<select required value={settings.exhibitions_home_event} onChange={e => setSettings(current => ({ ...current, exhibitions_home_event: e.target.value, exhibitions_home_result: "" }))}><option value="">Elegí una participación</option>{events.filter(event => event.published).map(event => <option key={event.id} value={event.id}>{event.name} · {event.year}</option>)}</select></label><label>Animal o premio protagonista<select value={settings.exhibitions_home_result} onChange={e => changeSettings("exhibitions_home_result", e.target.value)}><option value="">Destacar la participación completa</option>{selectedEvent?.results.map(r => <option key={r.id} value={r.id}>{r.name}{r.award ? ` · ${r.award}` : ""}</option>)}</select></label><label>Ubicación en Inicio<select value={settings.exhibitions_home_position} onChange={e => changeSettings("exhibitions_home_position", e.target.value)}><option value="before_genetics">Antes de Genética</option><option value="before_auction">Después de Genética</option><option value="after_auction">Después del Remate</option></select></label><label>Antetítulo del destacado<input value={settings.exhibitions_home_eyebrow} onChange={e => changeSettings("exhibitions_home_eyebrow", e.target.value)} /></label></>}</div></form>
      <section className="expoAdminList" aria-label="Participaciones guardadas">{events.map(event => <article className="adminPanel" key={event.id}>{images[event.imageKey] && <img src={images[event.imageKey]} alt={event.name} />}<div><small>{event.year}{event.location ? ` · ${event.location}` : ""}</small><h2>{event.name}</h2><p>{event.results.length} animales · {event.results.filter(r => r.award).length} reconocimientos</p><span className={`statusPill ${event.published ? "" : "draft"}`}>{event.published ? "Visible al publicar cambios" : "Oculta"}</span><div className="expoAdminActions"><button type="button" onClick={() => { setEditor(event); setError(""); setMessage(""); }}>Editar participación</button><a href={`/exposiciones/${event.slug}?preview=1`} target="_blank" rel="noopener noreferrer">Vista previa ↗</a><button type="button" disabled={busy} onClick={() => void remove(event)}>Quitar</button></div></div></article>)}{!events.length && <section className="adminPanel expoAdminEmpty"><h2>La historia en las pistas empieza acá.</h2><p>Creá una participación y agregá sus animales, fotos y resultados. La sección aparecerá en el menú cuando publiques la primera.</p><button onClick={() => setEditor(newEvent())}>Crear primera participación</button></section>}</section>
    </>}
  </>;
}
