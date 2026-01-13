"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
          password: password,
          role: "STUDENT",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Registrasi gagal");
        return;
      }

      alert("Registrasi berhasil, silakan login");
      router.push("/login");
    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 px-4 pt-10 flex items-start justify-center">
      {/* CARD REGISTER DIPERKECIL + JARAK AMAN DARI FOOTER */}
      <div className="w-full max-w-xs bg-white rounded-xl shadow-lg p-5 mb-16">
        <h1 className="text-lg font-semibold text-center mb-1">
          Register Akun
        </h1>
        <p className="text-center text-gray-500 text-sm mb-4">
          Role akun otomatis sebagai <b>User</b>
        </p>

        {error && (
          <div className="mb-3 rounded-lg bg-red-100 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Nama lengkap"
              required
              minLength={3}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="email@contoh.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ulangi password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
            Role akan otomatis diset sebagai <b>User</b>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
