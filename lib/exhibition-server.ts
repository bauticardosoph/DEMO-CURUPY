import "server-only";
import { cache } from "react";
import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../db";
import { siteContent } from "../db/schema";
import { publishedExhibitions } from "./exhibitions";

export const getPublishedExhibitions = cache(async () => {
  const rows = await getDb().select({ key: siteContent.contentKey, value: siteContent.value }).from(siteContent).where(and(
    eq(siteContent.cabinId, Number(process.env.NEXT_PUBLIC_CABIN_ID || 1)),
    inArray(siteContent.contentKey, ["exhibitions_json", "show_exhibitions"]),
  ));
  return publishedExhibitions(Object.fromEntries(rows.map(row => [row.key, row.value])));
});
