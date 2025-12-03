import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Xeno Analytics - Shopify Store Insights",
  description: "Multi-tenant analytics dashboard for Shopify stores. Track revenue, customers, orders, and more.",
  keywords: ["shopify", "analytics", "dashboard", "ecommerce", "metrics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
