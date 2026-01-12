export default function Footer() {
  return (
    <footer className="py-12 bg-white text-center text-slate-400 text-sm border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-8">
        <p className="font-medium text-slate-600 mb-1">
          © 2026 PROJECT_KEL1_BODYSENSOR
        </p>
        <p>Built for Tugas Akhir PAW • Kelompok 1</p>
        <div className="mt-4 flex justify-center gap-6">
          <span className="hover:text-blue-600 cursor-pointer">Documentation</span>
          <span className="hover:text-blue-600 cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}