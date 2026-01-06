# BodySensor - Kelompok 1

## 📦 Cara Install Next.js dengan Bun

Dokumentasi lengkap untuk instalasi dan menjalankan Next.js menggunakan Bun sebagai package manager.

---

## 🚀 Langkah 1: Install Bun

### Untuk Linux/macOS:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Untuk Windows:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Setelah instalasi selesai, tutup dan buka kembali terminal Anda, lalu verifikasi instalasi:
```bash
bun --version
```

---

## 🎯 Langkah 2: Membuat Project Next.js Baru

### Opsi A: Membuat Project di Direktori `app`

Jika Anda ingin membuat project Next.js baru di direktori `app`:

```bash
# Masuk ke direktori project
cd /home/fadd/Documents/vscode/PROJECT_KEL1_BODYSENSOR

# Buat project Next.js menggunakan Bun
bun create next-app app

# Pilih opsi berikut saat ditanya:
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes (sesuai kebutuhan)
# ✔ Would you like to use `src/` directory? … No
# ✔ Would you like to use App Router? … Yes
# ✔ Would you like to customize the default import alias (@/*)? … No
```

### Opsi B: Jika Project Sudah Ada (seperti di repository ini)

Project Next.js sudah tersedia di direktori `app`, jadi Anda cukup install dependencies:

```bash
# Masuk ke direktori app
cd app

# Install semua dependencies menggunakan Bun
bun install
```

---

## 📁 Struktur Direktori Project

Setelah instalasi, struktur direktori `app` akan terlihat seperti ini:

```
app/
├── app/                    # App Router directory (Next.js 13+)
│   ├── page.tsx           # Halaman utama
│   ├── layout.tsx         # Layout utama
│   └── globals.css        # CSS global
├── public/                # File statis (images, fonts, dll)
├── node_modules/          # Dependencies
├── package.json           # Daftar dependencies
├── bun.lock              # Lock file Bun
├── next.config.ts        # Konfigurasi Next.js
├── tsconfig.json         # Konfigurasi TypeScript
└── README.md             # Dokumentasi project
```

---

## ⚡ Menjalankan Aplikasi

### Mode Development (untuk pengembangan):
```bash
cd app
bun dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

### Mode Production (untuk deployment):
```bash
cd app

# Build aplikasi
bun run build

# Jalankan aplikasi production
bun start
```

---

## 📝 Perintah-Perintah Penting

### Install package baru:
```bash
cd app
bun add nama-package
```

### Install package sebagai dev dependency:
```bash
cd app
bun add -d nama-package
```

### Uninstall package:
```bash
cd app
bun remove nama-package
```

### Update semua dependencies:
```bash
cd app
bun update
```

---

## 🔥 Kenapa Menggunakan Bun?

1. **⚡ Lebih Cepat**: Bun 20-30x lebih cepat dari npm/yarn dalam install dependencies
2. **🎯 All-in-One**: Runtime JavaScript + bundler + package manager dalam satu tool
3. **💾 Hemat Ruang**: Ukuran lebih kecil dan lebih efisien
4. **🔄 Kompatibel**: Mendukung semua package npm yang ada

---

## 🛠️ Troubleshooting

### Port 3000 sudah digunakan?
```bash
# Gunakan port lain
bun dev --port 3001
```

### Error saat install dependencies?
```bash
# Hapus node_modules dan lock file, lalu install ulang
rm -rf node_modules bun.lock
bun install
```

### Clear cache Bun:
```bash
bun pm cache rm
```

---

## 📚 Resources

- [Dokumentasi Bun](https://bun.sh/docs)
- [Dokumentasi Next.js](https://nextjs.org/docs)
- [Tutorial Next.js](https://nextjs.org/learn)

---

## 👥 Tim Pengembang

**Kelompok 1** - Project BodySensor