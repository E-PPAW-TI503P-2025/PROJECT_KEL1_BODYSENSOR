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
      {/* HAPUS h-screen & overflow-hidden */}
      <body className="bg-brand-grey text-brand-dark font-sans min-h-screen flex flex-col">
        <Navbar />

        {/* main fleksibel & ikut tinggi konten */}
        <main className="flex-grow">
          {children}
        </main>

        {/* footer ikut turun */}
        <Footer />
      </body>
    </html>
  );
}
