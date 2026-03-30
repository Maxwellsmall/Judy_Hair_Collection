import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../src/index.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Judy Hair Collection - Premium Quality Wigs & Bundles",
    template: "%s | Judy Hair Collection",
  },
  description: "Discover premium wigs and hairstyles designed to give you confidence and elegance. Shop bundles, wigs, and hair care products.",
  keywords: ["wigs", "hair bundles", "hair care", "beauty", "premium hair", "Judy Hair Collection"],
  authors: [{ name: "Judy Hair Collection" }],
  creator: "Judy Hair Collection",
  metadataBase: new URL("https://judy-hair-collection.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://judy-hair-collection.vercel.app",
    title: "Judy Hair Collection - Premium Quality Wigs & Bundles",
    description: "Discover premium wigs and hairstyles designed to give you confidence and elegance. Shop bundles, wigs, and hair care products.",
    siteName: "Judy Hair Collection",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Judy Hair Collection Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Judy Hair Collection - Premium Quality Wigs & Bundles",
    description: "Discover premium wigs and hairstyles designed to give you confidence and elegance. Shop bundles, wigs, and hair care products.",
    images: ["/logo.jpg"],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
