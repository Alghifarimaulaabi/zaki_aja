import type { Metadata, Viewport } from "next";
import { Dancing_Script, Poppins } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hadiah Special untuk Suci 💗",
  description: "Buka hadiahnya ya...",
  openGraph: {
    title: "Ada hadiah special untuk Suci 💗",
    description: "Buka hadiahnya ya...",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a0a24",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${dancingScript.variable} h-full`}
    >
      <body className="h-full overflow-hidden select-none bg-[#2a0a24] text-white">
        {children}
      </body>
    </html>
  );
}
