import "server-only";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "../db";
import { siteContent, siteImages } from "../db/schema";

const cabinId = Number(process.env.NEXT_PUBLIC_CABIN_ID || 1);

export const getPublicBootstrap = unstable_cache(async () => {
  const db = getDb();
  const [contentRows, imageRows] = await Promise.all([
    db.select({ key: siteContent.contentKey, value: siteContent.value }).from(siteContent).where(eq(siteContent.cabinId, cabinId)),
    db.select({ id: siteImages.id, imageKey: siteImages.imageKey, label: siteImages.label, storageKey: siteImages.storageKey, fallbackUrl: siteImages.fallbackUrl }).from(siteImages).where(eq(siteImages.cabinId, cabinId)),
  ]);
  return {
    content: Object.fromEntries(contentRows.map(row => [row.key, row.value])),
    images: imageRows.map(row => ({
      ...row,
      url: row.storageKey ? `/api/media?key=${encodeURIComponent(row.storageKey)}` : row.fallbackUrl,
    })),
  };
}, ["public-bootstrap", String(cabinId)], { revalidate: 30, tags: ["public-bootstrap"] });
