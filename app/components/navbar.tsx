"use client";
import Link from "next/link";
import { Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-brand-dark text-brand-grey shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Cpu className="w-8 h-8 text-brand-light" />
            <span className="text-xl font-bold tracking-tight">
              Smart<span className="text-brand-light">Room</span>
            </span>
          </div>

          {/* Menu Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="hover:text-brand-light transition">Home</Link>
              <Link href="/about" className="hover:text-brand-light transition">About</Link>
              <Link href="/register" className="bg-brand-medium hover:bg-brand-light px-5 py-2 rounded-full transition shadow-sm">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}