"use client";

import { useEffect } from "react";
import { EditModeProvider } from "@/components/admin/EditModeProvider";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";
import { AdminBar } from "@/components/admin/AdminBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PillNav } from "@/components/layout/PillNav";
import { NightSky } from "@/components/theme/NightSky";
import { CoverBanner } from "@/components/sections/CoverBanner";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Certifications } from "@/components/sections/Certifications";
import { WorkedWith } from "@/components/sections/WorkedWith";
import { Portfolio } from "@/components/sections/Portfolio";
import { Contact } from "@/components/sections/Contact";
import { CUSTOM_FONT_FAMILY, getThemeStyle, googleFontStylesheetUrl } from "@/lib/theme";
import { resolveSectionBackground } from "@/lib/backgrounds";
import type { SiteData } from "@/lib/types/database";

export function SiteShell({ data, forceLoginOpen = false }: { data: SiteData; forceLoginOpen?: boolean }) {
  const bg = (key: Parameters<typeof resolveSectionBackground>[0]) =>
    resolveSectionBackground(key, data.sectionBackgrounds, data.profile);

  const {
    theme_accent,
    theme_accent_hex,
    theme_font,
    custom_font_url,
    google_font_name,
    photo_glow_hex,
    photo_glow_intensity,
    page_glow_intensity,
  } = data.profile;
  useEffect(() => {
    // The theme vars below are also set inline on the wrapper div for
    // SSR/no-flash, but <html> is an ANCESTOR of that div, so it can't see
    // them — anything scoped to <html>/<body> (the real page scrollbar,
    // via `scrollbar-color`, and its glow, via --page-glow-intensity) would
    // otherwise stay on the default. Mirror them onto the root element too.
    const root = document.documentElement;
    const style = getThemeStyle({
      theme_accent,
      theme_accent_hex,
      theme_font,
      custom_font_url,
      google_font_name,
      photo_glow_hex,
      photo_glow_intensity,
      page_glow_intensity,
    });
    Object.entries(style).forEach(([key, value]) => {
      if (typeof value === "string") root.style.setProperty(key, value);
    });
  }, [
    theme_accent,
    theme_accent_hex,
    theme_font,
    custom_font_url,
    google_font_name,
    photo_glow_hex,
    photo_glow_intensity,
    page_glow_intensity,
  ]);

  return (
    <div className="font-sans" style={getThemeStyle(data.profile)}>
      {data.profile.custom_font_url && (
        <style>{`@font-face { font-family: "${CUSTOM_FONT_FAMILY}"; src: url("${data.profile.custom_font_url}"); font-display: swap; }`}</style>
      )}
      {!data.profile.custom_font_url && data.profile.google_font_name && (
        <link rel="stylesheet" href={googleFontStylesheetUrl(data.profile.google_font_name)} />
      )}
      <EditModeProvider isAdmin={data.isAdmin} forceLoginOpen={forceLoginOpen}>
        <NightSky />
        <CoverBanner profile={data.profile} />
        <Header profile={data.profile} />

        <main>
          <Hero
            profile={data.profile}
            floatingIcons={data.floatingIcons}
            socialLinks={data.socialLinks}
            background={bg("hero")}
          />
          <About profile={data.profile} background={bg("about")} />
          <Skills skills={data.skills} background={bg("skills")} />
          <Experience experience={data.experience} background={bg("experience")} />
          <Education education={data.education} background={bg("education")} />
          <Certifications certifications={data.certifications} background={bg("certifications")} />
          <WorkedWith brands={data.clientBrands} background={bg("worked_with")} />
          <Portfolio brands={data.portfolioBrands} skills={data.skills} background={bg("portfolio")} />
          <Contact profile={data.profile} socialLinks={data.socialLinks} background={bg("contact")} />
        </main>

        <Footer profile={data.profile} />
        <PillNav />

        <AdminLoginModal />
        <AdminBar profile={data.profile} sectionBackgrounds={data.sectionBackgrounds} />
      </EditModeProvider>
    </div>
  );
}
