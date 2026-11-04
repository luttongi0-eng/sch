import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CrayonCast Studio - Warm Sketchbook Schedule Maker",
  description: "16:9 Full HD Custom Schedule Maker for Streamers and Creators",
  colorScheme: "light",
};

export const viewport = {
  colorScheme: "light",
  themeColor: "#FBF9F5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FBF9F5] text-[#2C2825]">{children}</body>
    </html>
  );
}
