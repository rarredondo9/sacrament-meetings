import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Sacrament Meeting Planner',
  description: 'Plan, view, and print sacrament meeting programs.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Header /> 
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}