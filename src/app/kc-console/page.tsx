import { SiteShell } from "@/components/SiteShell";
import { getSiteData } from "@/lib/data";

// Unlinked on purpose — no nav, sitemap, or robots entry points here. This is
// the private fallback way in when the footer's hidden click gesture isn't
// convenient (e.g. from a phone).
export default async function AdminConsolePage() {
  const data = await getSiteData();
  return <SiteShell data={data} forceLoginOpen={!data.isAdmin} />;
}
