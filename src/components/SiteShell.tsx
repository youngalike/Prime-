"use client";

import { EditModeProvider } from "@/components/admin/EditModeProvider";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";
import { AdminBar } from "@/components/admin/AdminBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DotNav } from "@/components/layout/DotNav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Certifications } from "@/components/sections/Certifications";
import { Portfolio } from "@/components/sections/Portfolio";
import { Contact } from "@/components/sections/Contact";
import type { SiteData } from "@/lib/types/database";

export function SiteShell({ data, forceLoginOpen = false }: { data: SiteData; forceLoginOpen?: boolean }) {
  const shortName = data.profile.full_name.split(" ").slice(0, 2).join(" ") || "Portfolio";

  return (
    <EditModeProvider isAdmin={data.isAdmin} forceLoginOpen={forceLoginOpen}>
      <Header shortName={shortName} />
      <DotNav />

      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Education education={data.education} />
        <Certifications certifications={data.certifications} />
        <Portfolio brands={data.portfolioBrands} />
        <Contact profile={data.profile} />
      </main>

      <Footer profile={data.profile} />

      <AdminLoginModal />
      <AdminBar />
    </EditModeProvider>
  );
}
