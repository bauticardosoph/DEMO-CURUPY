import { getPublicBootstrap } from "../lib/public-bootstrap";
import { optimizedImageUrl } from "../lib/image-url";
import { SiteApplication, type Screen } from "./site-application";

export async function PublicSite({ initialScreen = "home", initialNewsSlug, initialAnimalId, initialPageSlug }: {
  initialScreen?: Screen;
  initialNewsSlug?: string;
  initialAnimalId?: number;
  initialPageSlug?: string;
}) {
  const initialPublicData = await getPublicBootstrap().catch(() => undefined);
  const hero = initialScreen === "home"
    ? initialPublicData?.images.find(image => image.imageKey === "home-hero")?.url
    : undefined;
  return <>
    {hero && <>
      <link rel="preload" as="image" href={optimizedImageUrl(hero, 900)} media="(max-width: 700px)" fetchPriority="high" />
      <link rel="preload" as="image" href={optimizedImageUrl(hero, 1920)} media="(min-width: 701px)" fetchPriority="high" />
    </>}
    <SiteApplication
      initialScreen={initialScreen}
      initialNewsSlug={initialNewsSlug}
      initialAnimalId={initialAnimalId}
      initialPageSlug={initialPageSlug}
      initialPublicData={initialPublicData}
    />
  </>;
}
