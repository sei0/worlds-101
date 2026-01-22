import type { Metadata } from "next";
import { Zalando_Sans_Expanded } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const zalandoSans = Zalando_Sans_Expanded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-zalando",
});

export const metadata: Metadata = {
  title: "LoL Worlds Gacha",
  description: "LoL 월드 챔피언십 선수 가챠 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={zalandoSans.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
