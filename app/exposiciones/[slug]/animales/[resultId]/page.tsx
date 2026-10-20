import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSite } from "../../../../public-site";
import { SiteApplication } from "../../../../site-application";
import { requireAdminUser } from "../../../../auth";
import { getPublishedExhibitions } from "../../../../../lib/exhibition-server";
import { exhibitionResultPath } from "../../../../../lib/exhibitions";

type Props = { params: Promise<{ slug: string; resultId: string }>; searchParams: Promise<{ preview?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  if ((await searchParams).preview === "1") return { title: "Vista previa de animal en exposición", robots: { index: false, follow: false } };
  const { slug, resultId } = await params;
  const event = (await getPublishedExhibitions()).find(item => item.slug === slug);
  const result = event?.results.find(item => item.id === resultId);
  if (!event || !result) return { title: "Animal no disponible", robots: { index: false, follow: false } };
  return {
    title: `${result.name} · ${event.name} ${event.year}`,
    description: [result.name, result.award, `${event.name} ${event.year}`, "Pedigree y datos del ejemplar."].filter(Boolean).join(" · "),
    alternates: { canonical: exhibitionResultPath(event, result) },
  };
}

export default async function ExhibitionAnimalPage({ params, searchParams }: Props) {
  const { slug, resultId } = await params;
  if ((await searchParams).preview === "1") {
    await requireAdminUser(exhibitionResultPath({ slug }, { id: resultId }, true));
    return <SiteApplication initialScreen="exposicion" initialPageSlug={slug} initialExhibitionResultId={resultId} initialPreview />;
  }
  const event = (await getPublishedExhibitions()).find(item => item.slug === slug);
  if (!event?.results.some(result => result.id === resultId)) notFound();
  return <PublicSite initialScreen="exposicion" initialPageSlug={slug} initialExhibitionResultId={resultId} />;
}
