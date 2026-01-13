import { Elysia, t } from 'elysia';
import { db } from '../lib/db';

export const motionRoutes = new Elysia({ prefix: '/api' })
    // ESP32 bakal nembak ke sini buat update status
    .post("/motion", async ({ body, set }) => {
        // TAMBAHIN INI
        console.log("---> DATA MASUK DARI ESP32:", body);

        const { deviceId, status } = body;

        try {
            // Konversi manual kalo ternyata hardware ngirim 1/0
            const isOccupied = typeof status === 'number' ? status === 1 : status;

            // 1. Update status ruangan sekarang
            const room = await db.room.update({
                where: { deviceId: deviceId },
                data: {
                    isOccupied: isOccupied,
                    lastMotion: new Date()
                }
            });

            // 2. SIMPEN KE DATABASE (History)
            await db.motionLog.create({
                data: {
                    roomId: room.id,
                    status: isOccupied,
                    timestamp: new Date()
                }
            });

            return { message: "Data logged and room updated" };
        } catch (error) {
            set.status = 404;
            return { error: "Device ID gak ada di DB. Bikin dulu ruangannya!" };
        }
    }, {
        body: t.Object({
            deviceId: t.String(),
            status: t.Any() // Pakai Any biar gak rewel pas nerima input dari ESP32
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
                                    type: 'number',
                                    example: 1,
                                    description: 'Status sensor: 1 = ada gerakan, 0 = tidak ada gerakan. Bisa juga kirim boolean (true/false)'
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
                404: {
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
