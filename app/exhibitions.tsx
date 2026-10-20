"use client";

import Link from "next/link";
import { useState } from "react";
import { readAnimalImagePresentation } from "../lib/animal-image";
import { optimizedImageUrl } from "../lib/image-url";
import {
  exhibitionAnimalPath, exhibitionContactUrl, exhibitionVideoEmbed, featuredExhibition, parseExhibitions, publishedExhibitions,
  type Exhibition, type ExhibitionAnimal, type ExhibitionResult,
} from "../lib/exhibitions";
import "./exhibitions.css";
import { ExhibitionGeneticsView } from "./exhibition-genetics";

type Content = Record<string, string>;
type Props = { content: Content; images: Content; animals: ExhibitionAnimal[]; preview?: boolean };
const detailPath = (event: Exhibition, preview = false) => `/exposiciones/${event.slug}${preview ? "?preview=1" : ""}`;
const imageFor = (key: string, images: Content, fallback = "") => key ? images[key] || fallback : fallback;
const linkedAnimal = (result: ExhibitionResult, animals: ExhibitionAnimal[]) => animals.find(a => a.id === result.animalId && a.status === "published");
const dateLabel = (date: string) => date ? new Intl.DateTimeFormat("es-UY", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Montevideo" }).format(new Date(`${date}T12:00:00Z`)) : "";

function ResultImage({ result, images, animals, fallback = "" }: { result: ExhibitionResult; images: Content; animals: ExhibitionAnimal[]; fallback?: string }) {
  const animal = linkedAnimal(result, animals);
  const image = imageFor(result.imageKey, images, animal ? readAnimalImagePresentation(animal.image).source : fallback);
  return image ? <img src={optimizedImageUrl(image, 1000)} alt={`${result.name}${result.award ? ` · ${result.award}` : ""}`} loading="lazy" /> : null;
}

export function ExhibitionLinks({ result, content, animals }: { result: ExhibitionResult; content: Content; animals: ExhibitionAnimal[] }) {
  const animal = linkedAnimal(result, animals);
  const path = animal ? exhibitionAnimalPath(animal) : "";
  const semen = exhibitionContactUrl(content, result, "semen");
  const embryos = exhibitionContactUrl(content, result, "embryos");
  if (!path && !semen && !embryos) return null;
  return <div className="exhibitionLinks">
    {path && <Link href={path}>Ver ficha <span aria-hidden="true">↗</span></Link>}
    {semen && <a href={semen} target="_blank" rel="noopener noreferrer">Consultar semen <span aria-hidden="true">↗</span></a>}
    {embryos && <a href={embryos} target="_blank" rel="noopener noreferrer">Consultar embriones <span aria-hidden="true">↗</span></a>}
  </div>;
}

export function ExhibitionHome({ content, images, animals, preview }: Props) {
  const selected = featuredExhibition(content);
  if (!selected) return null;
  const { event, result } = selected;
  const cover = imageFor(event.imageKey, images);
  const hasImage = Boolean(cover || (result && (images[result.imageKey] || linkedAnimal(result, animals)?.image)));
  return <section className={`exhibitionHome ${hasImage ? "" : "exhibitionNoImage"}`} aria-labelledby="home-exhibition-title">
    {hasImage && <div className="exhibitionHomeImage">{result ? <ResultImage result={result} images={images} animals={animals} fallback={cover} /> : <img src={optimizedImageUrl(cover, 1400)} alt={event.name} loading="lazy" />}</div>}
    <div className="exhibitionHomeCopy">
      <p className="sectionNumber">{content.exhibitions_home_eyebrow || "En las pistas"}</p>
      <h2 id="home-exhibition-title">{result?.award || content.exhibitions_title || "Nuestro paso por las pistas"}</h2>
      <p className="exhibitionProvenance">{event.name} · {event.year}</p>
      {result ? <><h3>{result.name}</h3>{result.rp && <span className="exhibitionReference">RP {result.rp}{result.breed ? ` · ${result.breed}` : ""}</span>}{result.notes && <p>{result.notes}</p>}<ExhibitionLinks result={result} content={content} animals={animals} /></> : event.summary && <p>{event.summary}</p>}
      <Link className="exhibitionTextLink" href={detailPath(event, preview)}>Conocer la participación <span aria-hidden="true">→</span></Link>
    </div>
  </section>;
}

function ResultCard({ result, images, animals, content }: { result: ExhibitionResult } & Props) {
  return <article className={`exhibitionResult ${result.champion ? "exhibitionChampion" : ""}`}>
    <div className="exhibitionResultImage"><ResultImage result={result} images={images} animals={animals} />{result.champion && <span className="exhibitionDistinction">Reconocimiento destacado</span>}</div>
    <div className="exhibitionResultCopy">
      {result.award && <p className="exhibitionAward">{result.award}</p>}
      <h3>{result.name}</h3>
      {(result.rp || result.breed || result.category) && <p className="exhibitionReference">{[result.rp ? `RP ${result.rp}` : "", result.breed, result.category].filter(Boolean).join(" · ")}</p>}
      {result.notes && <p>{result.notes}</p>}
      {result.provider && (result.semen || result.embryos) && <p className="exhibitionProvider">Comercialización: {result.provider}</p>}
      <ExhibitionLinks result={result} content={content} animals={animals} />
    </div>
    <ExhibitionGeneticsView result={result} animal={linkedAnimal(result, animals)} />
  </article>;
}

export function ExhibitionsView({ slug, ...props }: Props & { slug?: string }) {
  const { content, images, preview } = props;
  const [year, setYear] = useState("");
  const [breed, setBreed] = useState("");
  const [query, setQuery] = useState("");
  const events = preview ? parseExhibitions(content.exhibitions_json).sort((a, b) => b.year.localeCompare(a.year) || b.date.localeCompare(a.date)) : publishedExhibitions(content);
  const root = `/exposiciones${preview ? "?preview=1" : ""}`;
  if (slug) {
    const event = events.find(e => e.slug === slug);
    if (!event) return <section className="exhibitionEmpty"><h1>Esta participación no está disponible.</h1><Link href={root}>Ver exposiciones →</Link></section>;
    const cover = imageFor(event.imageKey, images);
    const champions = event.results.filter(r => r.champion);
    const results = event.results.filter(r => !r.champion);
    const photos = event.photos.filter(p => images[p.imageKey]);
    return <>
      <section className={`exhibitionDetailHero ${cover ? "" : "exhibitionNoImage"}`}>
        {cover && <img className="exhibitionCover" src={optimizedImageUrl(cover, 1920)} alt={event.name} fetchPriority="high" />}
        <div className="exhibitionDetailHeading"><Link href={root}>← Volver a exposiciones</Link><p className="exhibitionEyebrow">Exposiciones y reconocimientos · {event.year}</p><h1>{event.name}</h1>{(event.date || event.location) && <p className="exhibitionEventMeta">{[dateLabel(event.date), event.location].filter(Boolean).join(" · ")}</p>}</div>
      </section>
      {(event.summary || event.story) && <section className="exhibitionStory">{event.summary && <p className="exhibitionLead">{event.summary}</p>}{event.story && <div>{event.story.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>}</section>}
      {champions.length > 0 && <section className="exhibitionWinners"><header><p className="sectionNumber">Reconocimientos destacados</p><h2>Resultados que hacen historia.</h2></header>{champions.map(result => <ResultCard key={result.id} result={result} {...props} />)}</section>}
      {results.length > 0 && <section className="exhibitionParticipants"><header><p className="sectionNumber">Nuestra participación</p><h2>Animales en pista.</h2></header><div>{results.map(result => <ResultCard key={result.id} result={result} {...props} />)}</div></section>}
      {photos.length > 0 && <section className="exhibitionGallery"><header><p className="sectionNumber">La exposición en imágenes</p><h2>Momentos compartidos.</h2></header><div>{photos.map(photo => <figure key={photo.id}><img src={optimizedImageUrl(images[photo.imageKey], 1100)} alt={photo.caption || event.name} loading="lazy" />{(photo.caption || photo.date) && <figcaption>{photo.caption}{photo.date && <time dateTime={photo.date}>{dateLabel(photo.date)}</time>}</figcaption>}</figure>)}</div></section>}
      {event.videos.length > 0 && <section className="exhibitionVideos"><header><p className="sectionNumber">En movimiento</p><h2>Desde la pista.</h2></header>{event.videos.map(video => { const embed = exhibitionVideoEmbed(video.url); return <figure key={video.id}>{embed ? <iframe src={embed} title={video.caption || `Video de ${event.name}`} loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <a href={video.url} target="_blank" rel="noopener noreferrer">{video.caption || "Ver video de la exposición"} ↗</a>}{embed && video.caption && <figcaption>{video.caption}</figcaption>}</figure>; })}</section>}
      <div className="exhibitionBack"><Link className="exhibitionTextLink" href={root}>Todas las exposiciones →</Link></div>
    </>;
  }
  const years = [...new Set(events.map(e => e.year))].sort().reverse();
  const breeds = [...new Set(events.flatMap(e => e.results.map(r => r.breed)).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const normalized = query.trim().toLocaleLowerCase("es");
  const filtered = events.filter(e => (!year || e.year === year) && (!breed || e.results.some(r => r.breed === breed)) && (!normalized || [e.name, e.location, ...e.results.flatMap(r => [r.name, r.rp, r.award])].some(value => value.toLocaleLowerCase("es").includes(normalized))));
  return <>
    <section className="exhibitionPageTitle"><p className="sectionNumber">{content.exhibitions_eyebrow || "Exposiciones y reconocimientos"}</p><h1>{content.exhibitions_title || "Nuestro paso por las pistas."}</h1>{content.exhibitions_intro && <p>{content.exhibitions_intro}</p>}</section>
    {events.length > 0 && <section className="exhibitionFilters" aria-label="Filtrar exposiciones"><label>Buscar<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Exposición, animal o premio" /></label>{years.length > 1 && <label>Año<select value={year} onChange={e => setYear(e.target.value)}><option value="">Todos los años</option>{years.map(y => <option key={y}>{y}</option>)}</select></label>}{breeds.length > 1 && <label>Raza<select value={breed} onChange={e => setBreed(e.target.value)}><option value="">Todas las razas</option>{breeds.map(b => <option key={b}>{b}</option>)}</select></label>}</section>}
    {filtered.length ? <section className="exhibitionGrid">{filtered.map(event => { const cover = imageFor(event.imageKey, images); const highlights = event.results.filter(r => r.champion && r.award); return <article key={event.id}><Link href={detailPath(event, preview)} className="exhibitionEventLink">{cover && <div className="exhibitionEventImage"><img src={optimizedImageUrl(cover, 1100)} alt={event.name} loading="lazy" /><span>{event.year}</span></div>}<div className="exhibitionEventCopy"><p className="exhibitionEyebrow">{[!cover ? event.year : "", event.location].filter(Boolean).join(" · ")}</p><h2>{event.name}</h2>{event.summary && <p>{event.summary}</p>}{highlights.length > 0 && <p className="exhibitionAward">{highlights.slice(0, 2).map(r => r.award).join(" · ")}</p>}<span className="exhibitionTextLink">Ver participación <span aria-hidden="true">↗</span></span></div></Link></article>; })}</section> : <section className="exhibitionEmpty"><h2>{events.length ? "No encontramos participaciones con esos filtros." : "Próximamente compartiremos nuestras participaciones."}</h2>{events.length > 0 && <button onClick={() => { setYear(""); setBreed(""); setQuery(""); }}>Limpiar filtros</button>}</section>}
  </>;
}

export function AnimalExhibitionHonours({ content, animal }: Omit<Props, "animals"> & { animal: ExhibitionAnimal }) {
  const matches = publishedExhibitions(content).flatMap(event => event.results.filter(r => r.animalId === animal.id).map(result => ({ event, result })));
  if (!animal.id || !matches.length) return null;
  return <section className="animalExhibitionHonours"><header><p className="sectionNumber">Trayectoria en las pistas</p><h2>Premios y exposiciones.</h2></header><div>{matches.map(({ event, result }) => <article key={`${event.id}-${result.id}`}><p className="exhibitionProvenance">{event.name} · {event.year}</p>{result.award && <h3>{result.award}</h3>}{result.category && <p>{result.category}</p>}{result.notes && <p>{result.notes}</p>}<ExhibitionLinks result={result} content={content} animals={[]} /><Link className="exhibitionTextLink" href={detailPath(event)}>Ver participación →</Link></article>)}</div></section>;
}
