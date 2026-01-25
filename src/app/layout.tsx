import type { Metadata } from "next";
import { Special_Gothic_Condensed_One, Special_Gothic_Expanded_One, Special_Gothic } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const specialGothicExpanded = Special_Gothic_Expanded_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
});

const specialGothicCondensed = Special_Gothic_Condensed_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-player",
});

const specialGothic = Special_Gothic({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "LOL WORLDS GACHA",
  description: "Collect player cards from LoL World Championship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${specialGothicExpanded.variable} ${specialGothicCondensed.variable} ${specialGothic.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
