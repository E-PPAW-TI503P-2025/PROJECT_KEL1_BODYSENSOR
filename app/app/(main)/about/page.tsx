"use client";
import Link from "next/link";
import { Users, Cpu, ShieldCheck, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-brand-grey min-h-screen">
      <main className="pt-[120px] pb-20 px-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">
            Tentang <span className="text-brand-medium">SmartRoom</span>
          </h1>
          <p className="text-lg text-brand-light leading-relaxed max-w-3xl mx-auto">
            SmartRoom adalah sistem monitoring okupansi ruangan berbasis IoT yang dirancang 
            untuk meningkatkan efisiensi penggunaan energi dan manajemen ruang secara real-time.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-light/10">
            <Cpu className="text-brand-medium w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold text-brand-dark mb-2">Teknologi Modern</h3>
            <p className="text-brand-light leading-relaxed">
              Menggunakan mikrokontroler ESP32 dan sensor BodySensor (PIR) berkualitas tinggi 
              untuk deteksi presisi tinggi dengan konsumsi daya rendah.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-light/10">
            <Globe className="text-brand-medium w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold text-brand-dark mb-2">Akses Dimana Saja</h3>
            <p className="text-brand-light leading-relaxed">
              Terhubung dengan dashboard berbasis web yang memungkinkan Anda memantau status 
              ruangan secara instan dari perangkat apa pun melalui jaringan internet.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-brand-dark rounded-[40px] p-10 text-white">
          <div className="flex items-center gap-4 mb-8">
            <Users className="w-8 h-8 text-brand-medium" />
            <h2 className="text-2xl font-bold">Kelompok 1 - Tim Pengembang</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contoh daftar anggota tim */}
            {["Hanifatul Nadiva","Hafizh Harimurti","Firyal Shafa Salsabila","M. Irsyad Rahmad Maulana", "M. Abdullah Faqih", "Panji Pranantya Imadulhaq", "Asyura Azzahra Djola", "Andhika Prima Hutama", "Tasnim Fadillah Anwar"].map((name, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                <p className="font-semibold text-brand-grey">{name}</p>
                <p className="text-xs text-brand-light/60 mt-1 uppercase tracking-wider">Developer / Engineering</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-brand-light/70 text-sm">
              Proyek ini dikembangkan sebagai bagian dari Tugas Akhir mata kuliah <br />
              <span className="font-bold text-white">Pengembangan Aplikasi Web (PAW)</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}