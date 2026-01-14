"use client";

import Link from "next/link";
import AboutPage from "./about/page";
import { MoveRight, Radio, LayoutDashboard, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-brand-grey">
      {/* Konten Utama dengan Padding Top agar tidak tertutup Navbar */}
      <main className="pt-[100px] pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-dark/5 text-brand-medium border border-brand-light/20 mb-6">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">IoT Smart Occupancy</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-dark leading-tight mb-6">
            Monitor Ruangan <br />
            <span className="text-brand-medium">Secara Real-Time</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-brand-light mb-10 leading-relaxed">
            Solusi cerdas dari Kelompok 1 untuk memantau keberadaan orang di dalam ruangan menggunakan BodySensor. Terintegrasi langsung dengan ESP32.
          </p>
          
          <Link 
            href="login" 
            className="inline-flex items-center gap-2 bg-brand-dark text-brand-grey px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-medium transition-all shadow-xl shadow-brand-dark/20"
          >
            Mulai Sekarang
            <MoveRight className="w-5 h-5" />
          </Link>
        </div>

        {/* FEATURE PREVIEW */}
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-white p-8 rounded-3xl border border-brand-light/10 shadow-sm">
            <LayoutDashboard className="text-brand-medium mb-4 w-10 h-10" />
            <h3 className="font-bold text-xl text-brand-dark mb-2">Dashboard</h3>
            <p className="text-brand-light text-sm">Pantau status ruangan melalui antarmuka web yang interaktif.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-brand-light/10 shadow-sm">
            <Radio className="text-brand-medium mb-4 w-10 h-10" />
            <h3 className="font-bold text-xl text-brand-dark mb-2">Sensor PIR</h3>
            <p className="text-brand-light text-sm">Deteksi gerakan manusia yang presisi menggunakan BodySensor.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-brand-light/10 shadow-sm">
            <Clock className="text-brand-medium mb-4 w-10 h-10" />
            <h3 className="font-bold text-xl text-brand-dark mb-2">Cepat & Akurat</h3>
            <p className="text-brand-light text-sm">Update data dari hardware ke website dalam hitungan detik.</p>
          </div>
        </div>
      </main>
      <AboutPage />
    </div>
  );
}