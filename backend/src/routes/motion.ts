import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export const motionRoutes = new Elysia({ prefix: '/api' })
    // ESP32 bakal nembak ke sini buat update status
    .post("/motion", async ({ body }) => {
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
    });
