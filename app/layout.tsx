import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Judy Hair Collection - Premium Quality Wigs & Bundles",
  description: "Discover premium wigs and hairstyles designed to give you confidence and elegance. Shop bundles, wigs, and hair care products.",
  keywords: ["wigs", "hair bundles", "hair care", "beauty", "premium hair"],
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
