// app/layout.tsx
import "./globals.css"; // <--- WAJIB ADA DI SINI
import { Inter } from "next/font/google"; // Jika Anda pakai font

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* CSS globals.css akan otomatis masuk ke sini via body class */}
      <body className={`${inter.className} bg-brand-grey text-brand-dark min-h-screen`}>
        {children} 
      </body>
    </html>
  );
}