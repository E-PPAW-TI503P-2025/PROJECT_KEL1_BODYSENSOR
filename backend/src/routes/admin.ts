import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export const adminRoutes = new Elysia({ prefix: '/api/admin' })
    // Tambah ruangan baru
    .post("/rooms", async ({ body }) => {
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
    });
