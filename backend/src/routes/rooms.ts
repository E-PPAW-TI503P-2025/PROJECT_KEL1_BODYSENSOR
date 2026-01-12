import { Elysia, t } from 'elysia';
import { db } from '../lib/db';

export const roomsRoutes = new Elysia({ prefix: '/api' })
    // Ambil semua daftar ruangan
    .get("/rooms", async () => {
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
    });
