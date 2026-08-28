import type { Metadata } from "next";
import Script from "next/script";
import { fontVariables } from "@/lib/fonts";
import { ThemeModeProvider } from "@/components/theme/ThemeModeProvider";
import { ThemedToaster } from "@/components/theme/ThemedToaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alike Kingsley Chukwudi — Graphic Designer & Front-End Developer",
  description:
    "Portfolio of Alike Kingsley Chukwudi — Graphic Designer, Front-End Developer and IT Specialist.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{
  var KEY="theme-preference",p=localStorage.getItem(KEY),m;
  if(p==="light"||p==="dark"){m=p;}
  else{var h=new Date().getHours();m=(h>=6&&h<19)?"light":"dark";}
  document.documentElement.setAttribute("data-theme",m);
}catch(e){}})();`}
        </Script>
        <ThemeModeProvider>
          {children}
          <ThemedToaster />
        </ThemeModeProvider>
      </body>
    </html>
  );
}
