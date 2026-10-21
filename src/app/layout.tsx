import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "SportsBooks — Odds workspace",
  description:
    "Compare sportsbook odds, explore two-way markets and calculate balanced stake allocations.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle('dark',localStorage.getItem('sportsbooks.theme')!=='light')}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
