import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontsans = Plus_Jakarta_Sans({
  subsets:['latin'],
  weight:['300','400','500','600','700'],
  variable:'--font-sans'
})

export const metadata: Metadata = {
  title: "CarePlus",
  description: "A healthcare management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('min-h-screen bg-dark-300 font-sans antialiased',fontsans.variable)}
      >
        {children}
      </body>
    </html>
  );
}
