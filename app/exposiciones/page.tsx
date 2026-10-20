import type { Metadata } from "next";
import { PublicSite } from "../public-site";
import { SiteApplication } from "../site-application";
import { requireAdminUser } from "../auth";

type Props = { searchParams: Promise<{ preview?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const preview = (await searchParams).preview === "1";
  return { title: "Exposiciones y reconocimientos", ...(preview ? { robots: { index: false, follow: false } } : {}) };
}
export default async function ExhibitionsPage({ searchParams }: Props) {
  if ((await searchParams).preview === "1") {
    await requireAdminUser("/exposiciones?preview=1");
    return <SiteApplication initialScreen="exposiciones" initialPreview />;
  }
  return <PublicSite initialScreen="exposiciones" />;
}
