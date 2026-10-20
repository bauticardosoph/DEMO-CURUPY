import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSite } from "../../public-site";
import { SiteApplication } from "../../site-application";
import { requireAdminUser } from "../../auth";
import { getPublishedExhibitions } from "../../../lib/exhibition-server";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  if ((await searchParams).preview === "1") return { title: "Vista previa de exposición", robots: { index: false, follow: false } };
  const { slug } = await params;
  const event = (await getPublishedExhibitions()).find(item => item.slug === slug);
  if (!event) return { title: "Participación no disponible", robots: { index: false, follow: false } };
  const title = `${event.name} ${event.year}`;
  return { title, description: event.summary || `Participación y resultados en ${event.name}, ${event.year}.`, alternates: { canonical: `/exposiciones/${event.slug}` } };
}
export default async function ExhibitionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if ((await searchParams).preview === "1") {
    await requireAdminUser(`/exposiciones/${slug}?preview=1`);
    return <SiteApplication initialScreen="exposicion" initialPageSlug={slug} initialPreview />;
  }
  if (!(await getPublishedExhibitions()).some(event => event.slug === slug)) notFound();
  return <PublicSite initialScreen="exposicion" initialPageSlug={slug} />;
}
