import { SiteShell } from "@/components/SiteShell";
import type { SiteData } from "@/lib/types/database";

// Temporary route for local visual QA with the seeded CV content, before a
// real Supabase project is wired up. Not part of the shipped site — delete
// once the design has been checked in the browser.

const mockData: SiteData = {
  profile: {
    id: "singleton",
    full_name: "Alike Kingsley Chukwudi",
    title: "Graphic Designer / Front-End Developer / IT Specialist",
    bio: "I am a Graphic Designer, Front-End Developer and IT Specialist with over 5 years of experience helping businesses promote themselves effectively. I started my graphic design journey 6 years ago, right after high school, teaching myself CorelDraw on YouTube while waiting for university admission. Since then I've worked with two major print companies as a design team lead and as a freelancer creating designs for clients around the world. I'm currently a 400-level student of Electronics and Computer Engineering at Nnamdi Azikiwe University, Awka. My work spans business cards, books, flyers, stickers, wallpapers, catalog layouts, large-scale graphics, web design and banners — using Adobe Photoshop and Illustrator, and CorelDraw above all.",
    photo_url: null,
    location: "Awka, Anambra State, Nigeria",
    email: "youngalike@icloud.com",
    phone_primary: "+234 816 590 8505",
    phone_secondary: "+234 805 080 2027",
    social_instagram: null,
    social_facebook: null,
    social_twitter: null,
    social_linkedin: "https://www.linkedin.com/in/alike-kingsley-chukwudi-2267a7310/",
    updated_at: new Date().toISOString(),
  },
  skills: [
    { id: "1", name: "CorelDraw Suite", category: "pc_mac", stars: 5, years_label: "5+ years", sort_order: 0 },
    { id: "2", name: "Adobe Photoshop", category: "pc_mac", stars: 4, years_label: "4+ years", sort_order: 1 },
    { id: "3", name: "Adobe Illustrator", category: "pc_mac", stars: 3, years_label: "1+ year", sort_order: 2 },
    { id: "4", name: "Microsoft Publisher", category: "pc_mac", stars: 3, years_label: "5+ years", sort_order: 3 },
    { id: "5", name: "Microsoft Word", category: "pc_mac", stars: 5, years_label: "7+ years", sort_order: 4 },
    { id: "6", name: "HTML5", category: "pc_mac", stars: 4, years_label: "3+ years", sort_order: 5 },
    { id: "7", name: "CSS3", category: "pc_mac", stars: 4, years_label: "2+ years", sort_order: 6 },
    { id: "8", name: "InShot", category: "mobile", stars: 4, years_label: "1+ year", sort_order: 0 },
    { id: "9", name: "PixelLab", category: "mobile", stars: 5, years_label: "4+ years", sort_order: 1 },
    { id: "10", name: "File Maintenance", category: "soft", stars: null, years_label: null, sort_order: 0 },
    { id: "11", name: "Time Management", category: "soft", stars: null, years_label: null, sort_order: 1 },
    { id: "12", name: "Risk Assessment", category: "soft", stars: null, years_label: null, sort_order: 2 },
    { id: "13", name: "Budget Management", category: "soft", stars: null, years_label: null, sort_order: 3 },
    { id: "14", name: "Creative Thinking", category: "soft", stars: null, years_label: null, sort_order: 4 },
    { id: "15", name: "Critical Thinking", category: "soft", stars: null, years_label: null, sort_order: 5 },
  ],
  experience: [
    {
      id: "e1",
      title: "Graphics Designer",
      company: "INX Studio",
      period: "2019 — Present",
      bullets: [
        "Founded INX Studio while working as a freelancer, designing for clients",
        "Joined freelancing platforms like Upwork and others to find and serve clients",
        "In charge of designing flyers, logos, banners, ID cards and other creative work",
      ],
      sort_order: 0,
    },
    {
      id: "e2",
      title: "I.T. Specialist",
      company: "Dataprosys Technologies Limited",
      period: "2017 — 2019",
      bullets: [
        "Chief Engineer in charge of printer repairs and servicing",
        "Took part in scheduled development meetings to recommend system modifications and improvements",
        "Spearheaded new techniques to solve recurring printer and system errors",
        "In charge of servicing and maintaining computer systems in case of a breakdown",
      ],
      sort_order: 1,
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "B.Sc. Electronics and Computer Engineering",
      school: "Nnamdi Azikiwe University, Awka",
      location: "Anambra, Nigeria",
      period: "2019 — Present",
      sort_order: 0,
    },
    {
      id: "ed2",
      degree: "West African Examination Certificate (WAEC)",
      school: "Okei-ira Grammar School",
      location: "Oke-ira, Ogba, Lagos, Nigeria",
      period: "2014 — 2016",
      sort_order: 1,
    },
  ],
  certifications: [
    { id: "c1", issuer: "Solution Innovation District Nigeria", title: "Graphics Design & Digital Marketing", credential_url: null, sort_order: 0 },
    { id: "c2", issuer: "University of Colorado Boulder", title: "Graphics Design", credential_url: "https://coursera.org", sort_order: 1 },
    { id: "c3", issuer: "Meta", title: "Intro to Front-End Development", credential_url: "https://coursera.org", sort_order: 2 },
    { id: "c4", issuer: "Meta", title: "Intro to Back-End Development", credential_url: "https://coursera.org", sort_order: 3 },
  ],
  portfolioBrands: [],
  isAdmin: false,
};

export default async function PreviewPage({
  searchParams,
}: {
  searchParams?: Promise<{ admin?: string }>;
}) {
  const params = await searchParams;
  return <SiteShell data={{ ...mockData, isAdmin: params?.admin === "1" }} />;
}
