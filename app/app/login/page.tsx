"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoveRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Email atau password salah");
        return;
      }

      // Simpan user (opsional)
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-brand-dark/5 p-8 border border-brand-light/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">Selamat Datang</h1>
          <p className="text-brand-light">Masuk untuk memonitor ruangan Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">Email</label>
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

          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/50" />
              <input
                type="password"
                required
                className="w-full bg-brand-grey/50 border border-brand-light/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-medium transition-all shadow-lg shadow-brand-dark/10 disabled:opacity-50 mt-4"
          >
            {loading ? "Memproses..." : "Masuk Sekarang"}
            {!loading && <MoveRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center mt-8 text-brand-light text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="text-brand-medium font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}