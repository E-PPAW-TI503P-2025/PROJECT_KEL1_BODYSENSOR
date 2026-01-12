import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

const db = new PrismaClient();

const app = new Elysia()
    .use(cors())
    .use(swagger({
        documentation: {
            info: {
                title: 'Smart Room API Documentation',
                version: '1.0.0',
                description: 'API untuk sistem Smart Room dengan sensor gerak dan manajemen ruangan'
            },
            tags: [
                { name: 'General', description: 'Endpoint umum' },
                { name: 'Rooms', description: 'Endpoint untuk data ruangan (User/Frontend)' },
                { name: 'IoT', description: 'Endpoint untuk ESP32 dan sensor IoT' },
                { name: 'Admin', description: 'Endpoint untuk administrasi ruangan' }
            ]
        }
    }))
    .get("/", () => "Smart Room API is Online 🚀", {
        detail: {
            tags: ['General'],
            summary: 'Health Check',
            description: 'Cek apakah API sudah online dan berjalan'
        }
    })

    // --- ENDPOINT UNTUK USER/FRONTEND ---
    // Ambil semua daftar ruangan
    .get("/api/rooms", async () => {
        return await db.room.findMany({
            include: { bookings: true }
        });
    }, {
        detail: {
            tags: ['Rooms'],
            summary: 'Get All Rooms',
            description: 'Ambil semua daftar ruangan beserta booking-nya',
            responses: {
                200: {
                    description: 'Daftar ruangan berhasil diambil',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'number' },
                                        name: { type: 'string' },
                                        capacity: { type: 'number' },
                                        deviceId: { type: 'string' },
                                        isOccupied: { type: 'boolean' },
                                        lastMotion: { type: 'string', format: 'date-time' },
                                        bookings: { type: 'array', items: { type: 'object' } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
        }),
        detail: {
            tags: ['IoT'],
            summary: 'Update Motion Status',
            description: 'Endpoint untuk ESP32 mengirim data sensor gerak dan update status ruangan',
            requestBody: {
                description: 'Data dari sensor ESP32',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                deviceId: {
                                    type: 'string',
                                    example: 'ESP32_001'
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'true = ada gerakan, false = tidak ada gerakan'
                                }
                            },
                            required: ['deviceId', 'status']
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Status ruangan berhasil diupdate',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    status: { type: 'boolean' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Device ID tidak ditemukan',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
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
        }),
        detail: {
            tags: ['Admin'],
            summary: 'Create New Room',
            description: 'Tambah ruangan baru ke database (Admin Only)',
            requestBody: {
                description: 'Data ruangan baru',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Ruang Meeting A'
                                },
                                capacity: {
                                    type: 'number',
                                    example: 10
                                },
                                deviceId: {
                                    type: 'string',
                                    example: 'ESP32_001'
                                }
                            },
                            required: ['name', 'capacity', 'deviceId']
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Ruangan berhasil dibuat',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    name: { type: 'string' },
                                    capacity: { type: 'number' },
                                    deviceId: { type: 'string' },
                                    isOccupied: { type: 'boolean' },
                                    lastMotion: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    .listen(3001);

console.log(`✅ Backend jalan di http://localhost:3001`);
console.log(`📚 Swagger UI: http://localhost:3001/swagger`);