// backend/src/index.ts
import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { PrismaClient } from '@prisma/client'

// Inisialisasi Database
const db = new PrismaClient()
const app = new Elysia()

app.use(cors()) // Penting: Agar Frontend Next.js bisa akses backend ini

// --- ENDPOINT 1: UNTUK ARDUINO (Kirim Data) ---
// Arduino menembak ke: POST http://localhost:8080/api/sensor
app.post('/api/sensor', async ({ body }) => {
  const { userId, value } = body as { userId: number, value: number }

  // 1. Ambil Settingan User
  let settings = await db.settings.findUnique({ where: { userId } })
  
  // Jika setting belum ada, buat default
  if (!settings) {
    settings = await db.settings.create({
      data: { userId, thresholdLimit: 100, monitoringMode: "OTOMATIS" }
    })
  }

  // 2. Cek Normal/Abnormal
  let status = "NORMAL"
  if (value > settings.thresholdLimit) status = "ABNORMAL"

  // 3. Simpan ke DB
  const log = await db.sensorLog.create({
    data: { userId, value, status }
  })

  // 4. Buat Alert jika Abnormal
  if (status === "ABNORMAL" && settings.enableNotify) {
    await db.alertHistory.create({
      data: { userId, message: `PERINGATAN: Nilai ${value} melebihi batas!` }
    })
  }

  return { status: 'Sukses', data: log }
})

// --- ENDPOINT 2: UNTUK FRONTEND (Lihat Data) ---
// Frontend fetch ke: GET http://localhost:8080/api/history/1
app.get('/api/history/:userId', async ({ params: { userId } }) => {
  return await db.sensorLog.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
})

// --- ENDPOINT 3: UNTUK ADMIN (Update Setting) ---
app.patch('/api/settings', async ({ body }) => {
  const { userId, newThreshold, mode } = body as any
  
  await db.settings.upsert({
    where: { userId: Number(userId) },
    update: { thresholdLimit: Number(newThreshold), monitoringMode: mode },
    create: { userId: Number(userId), thresholdLimit: Number(newThreshold), monitoringMode: mode }
  })

  return { message: "Setting disimpan!" }
})

// Jalankan Server di Port 8080 (Biar gak bentrok sama Next.js di 3000)
app.listen(8080)
console.log(`🦊 Backend IoT berjalan di http://localhost:8080`)