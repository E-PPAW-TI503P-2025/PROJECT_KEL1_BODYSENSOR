import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "SmartRoom - Kelompok 1",
  description: "Sistem Monitoring Occupancy Ruangan Berbasis IoT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* h-screen: pas satu layar | overflow-hidden: kunci scroll seluruh body */}
      <body className="bg-brand-grey text-brand-dark flex flex-col h-screen overflow-hidden font-sans">
        <Navbar />
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}