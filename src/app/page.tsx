import { SiteShell } from "@/components/SiteShell";
import { getSiteData } from "@/lib/data";

export default async function HomePage() {
  const data = await getSiteData();
  return <SiteShell data={data} />;
}
