"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoveRight, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_lengkap: fullName.trim(),
          email: email.trim(),
          password,
          role: "STUDENT",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registrasi gagal");
        return;
      }

      alert("Registrasi berhasil, silakan login");
      router.push("/login");
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-brand-dark/5 p-8 border border-brand-light/10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">
            Register Akun
          </h1>
          <p className="text-brand-light">
            Masuk untuk memonitor ruangan Anda
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAMA */}
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/50" />
              <input
                type="text"
                required
                minLength={3}
                className="w-full bg-brand-grey/50 border border-brand-light/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium transition-all"
                placeholder="Nama Lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/50" />
              <input
                type="email"
                required
                className="w-full bg-brand-grey/50 border border-brand-light/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium transition-all"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/50" />
              <input
                type="password"
                required
                minLength={8}
                className="w-full bg-brand-grey/50 border border-brand-light/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium transition-all"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* KONFIRMASI */}
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/50" />
              <input
                type="password"
                required
                minLength={8}
                className="w-full bg-brand-grey/50 border border-brand-light/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium transition-all"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* INFO */}
          <div className="p-4 bg-brand-grey/50 border border-brand-light/10 rounded-2xl text-sm flex gap-3 items-center text-brand-light">
            <div className="w-2 h-2 rounded-full bg-brand-medium animate-pulse" />
            <p>
              Role akun otomatis sebagai{" "}
              <span className="font-bold text-brand-dark">User</span>
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-medium transition-all shadow-lg shadow-brand-dark/10 disabled:opacity-50 mt-4"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
            {!loading && <MoveRight className="w-5 h-5" />}
          </button>
        </form>

        {/* FOOTER */}  
        <p className="text-center mt-8 text-brand-light text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-brand-medium font-bold hover:underline">
            Login Disini
          </Link>
        </p>
      </div>
    </div>
  );
}
