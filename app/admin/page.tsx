import { SiteApplication } from "../site-application";
import { requireAdminUser } from "../auth";
import "./importer.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminUser("/admin");
  return <SiteApplication initialScreen="admin"/>;
}
