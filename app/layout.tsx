import { AppProvider } from "@/components/AppProvider";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "AI Skill Trainer",
    template: "%s · AI Skill Trainer",
  },
  description: "A practice path for real-world skills, starting with the bench press.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
