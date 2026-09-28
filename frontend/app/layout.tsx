import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ground Link | Property in Honiara & the Solomon Islands",
  description: "Find your dream home in Honiara investment property with ease. Browse our curated listings of premium real estate, from modern apartments to spacious family homes. Start your property search today and discover the best deals in Honiara.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased`}
      >
        {children}

        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'text-base',
          }}
        />
      </body>
    </html>
  );
}
