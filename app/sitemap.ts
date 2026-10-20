import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "../lib/site-identity";
import { getPublishedExhibitions } from "../lib/exhibition-server";
import { exhibitionResultPath } from "../lib/exhibitions";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const siteUrl=getPublicSiteUrl();
  const routes=["","/la-cabana","/genetica","/actualidad","/galeria","/contacto"];
  const exhibitions=await getPublishedExhibitions().catch(()=>[]);
  const pages:MetadataRoute.Sitemap=routes.map((route,index)=>({url:`${siteUrl}${route}`,lastModified:new Date(),changeFrequency:index===0?"weekly":"monthly",priority:index===0?1:0.8}));
  if(exhibitions.length)pages.push({url:`${siteUrl}/exposiciones`,changeFrequency:"monthly",priority:0.8},...exhibitions.map(event=>({url:`${siteUrl}/exposiciones/${event.slug}`,changeFrequency:"monthly" as const,priority:0.7})));
  pages.push(...exhibitions.flatMap(event=>event.results.map(result=>({url:`${siteUrl}${exhibitionResultPath(event,result)}`,changeFrequency:"monthly" as const,priority:0.6}))));
  return pages;
}

