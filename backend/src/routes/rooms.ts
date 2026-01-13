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
    })

    // Ambil ruangan yang aktif/terisi (sensor mendeteksi gerakan)
    .get("/rooms/active", async () => {
        const activeRooms = await db.room.findMany({
            where: { isOccupied: true },
            include: { bookings: true }
        });
        return {
            total: activeRooms.length,
            rooms: activeRooms
        };
    }, {
        detail: {
            tags: ['Rooms'],
            summary: 'Get Active Sensors/Rooms',
            description: 'Ambil daftar ruangan yang sedang aktif (terdeteksi ada orang/isOccupied = true)',
            responses: {
                200: {
                    description: 'Daftar ruangan aktif berhasil diambil',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    total: {
                                        type: 'number',
                                        description: 'Jumlah ruangan yang aktif'
                                    },
                                    rooms: {
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
            }
        }
    })

    // Ambil ruangan yang offline/kosong (sensor tidak mendeteksi gerakan)
    .get("/rooms/offline", async () => {
        const offlineRooms = await db.room.findMany({
            where: { isOccupied: false },
            include: { bookings: true }
        });
        return {
            total: offlineRooms.length,
            rooms: offlineRooms
        };
    }, {
        detail: {
            tags: ['Rooms'],
            summary: 'Get Offline Sensors/Rooms',
            description: 'Ambil daftar ruangan yang sedang offline/kosong (tidak terdeteksi orang/isOccupied = false)',
            responses: {
                200: {
                    description: 'Daftar ruangan offline berhasil diambil',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    total: {
                                        type: 'number',
                                        description: 'Jumlah ruangan yang offline'
                                    },
                                    rooms: {
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
            }
        }
    });
