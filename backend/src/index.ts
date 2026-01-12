import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { cors } from '@elysiajs/cors';

const db = new PrismaClient();

const app = new Elysia()
    .use(cors())
    .get("/", () => "Smart Room API is Online 🚀")

    // --- ENDPOINT UNTUK USER/FRONTEND ---
    // Ambil semua daftar ruangan
    .get("/api/rooms", async () => {
        return await db.room.findMany({
            include: { bookings: true }
        });
    })

    // --- ENDPOINT UNTUK ESP32 (IoT) ---
    // ESP32 bakal nembak ke sini buat update status
    .post("/api/motion", async ({ body }) => {
        const { deviceId, status } = body;
        
        try {
            const room = await db.room.update({
                where: { deviceId: deviceId },
                data: {
                    isOccupied: status,
                    lastMotion: new Date()
                }
            });
            return { message: `Room ${room.name} status updated!`, status: room.isOccupied };
        } catch (error) {
            return { error: "Device ID tidak terdaftar di ruangan manapun." };
        }
    }, {
        body: t.Object({
            deviceId: t.String(),
            status: t.Boolean()
        })
    })

    // --- ENDPOINT ADMIN (CRUD) ---
    // Tambah ruangan baru
    .post("/api/admin/rooms", async ({ body }) => {
        return await db.room.create({ data: body });
    }, {
        body: t.Object({
            name: t.String(),
            capacity: t.Number(),
            deviceId: t.String()
        })
    })

    .listen(3001);

console.log(`✅ Backend jalan di http://localhost:3001`);