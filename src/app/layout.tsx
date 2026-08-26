import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alike Kingsley Chukwudi — Graphic Designer & Front-End Developer",
  description:
    "Portfolio of Alike Kingsley Chukwudi — Graphic Designer, Front-End Developer and IT Specialist.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(19,41,63,0.9)",
              border: "1px solid rgba(242,201,76,0.2)",
              color: "#f5f3ee",
            },
          }}
        />
      </body>
    </html>
  );
}
