import { Elysia, t } from 'elysia';
import { db } from '../lib/db';

export const bookingRoutes = new Elysia({ prefix: '/api/bookings' })
    // Create new booking
    .post("/", async ({ body, set }) => {
        try {
            // Validasi apakah room dan user exist
            const room = await db.room.findUnique({
                where: { id: body.roomId }
            });

            if (!room) {
                set.status = 404;
                return { error: "Room tidak ditemukan" };
            }

            const user = await db.user.findUnique({
                where: { id: body.userId }
            });

            if (!user) {
                set.status = 404;
                return { error: "User tidak ditemukan" };
            }

            // Cek apakah ada konflik booking di waktu yang sama
            const conflictBooking = await db.booking.findFirst({
                where: {
                    roomId: body.roomId,
                    OR: [
                        {
                            AND: [
                                { startTime: { lte: new Date(body.startTime) } },
                                { endTime: { gte: new Date(body.startTime) } }
                            ]
                        },
                        {
                            AND: [
                                { startTime: { lte: new Date(body.endTime) } },
                                { endTime: { gte: new Date(body.endTime) } }
                            ]
                        }
                    ]
                }
            });

            if (conflictBooking) {
                set.status = 409;
                return { error: "Room sudah dibooking di waktu tersebut" };
            }

            // Buat booking
            const booking = await db.booking.create({
                data: {
                    userId: body.userId,
                    roomId: body.roomId,
                    startTime: new Date(body.startTime),
                    endTime: new Date(body.endTime)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            nama_lengkap: true,
                            email: true
                        }
                    },
                    room: {
                        select: {
                            id: true,
                            name: true,
                            capacity: true
                        }
                    }
                }
            });

            set.status = 201;
            return { message: "Booking berhasil dibuat", booking };

        } catch (error) {
            set.status = 500;
            return { error: "Terjadi kesalahan saat membuat booking" };
        }
    }, {
        body: t.Object({
            userId: t.Number(),
            roomId: t.Number(),
            startTime: t.String(),
            endTime: t.String()
        }),
        detail: {
            tags: ['Bookings'],
            summary: 'Create Booking',
            description: 'Buat booking ruangan baru untuk user',
            requestBody: {
                description: 'Data booking baru',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                userId: {
                                    type: 'number',
                                    example: 1
                                },
                                roomId: {
                                    type: 'number',
                                    example: 1
                                },
                                startTime: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2026-01-13T09:00:00Z'
                                },
                                endTime: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2026-01-13T11:00:00Z'
                                }
                            },
                            required: ['userId', 'roomId', 'startTime', 'endTime']
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Booking berhasil dibuat',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    booking: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number' },
                                            userId: { type: 'number' },
                                            roomId: { type: 'number' },
                                            startTime: { type: 'string', format: 'date-time' },
                                            endTime: { type: 'string', format: 'date-time' },
                                            user: { type: 'object' },
                                            room: { type: 'object' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Room atau User tidak ditemukan'
                },
                409: {
                    description: 'Room sudah dibooking di waktu tersebut'
                }
            }
        }
    })

    // Get all bookings (with optional filter by userId)
    .get("/", async ({ query }) => {
        try {
            const bookings = await db.booking.findMany({
                where: query.userId ? { userId: parseInt(query.userId) } : undefined,
                include: {
                    user: {
                        select: {
                            id: true,
                            nama_lengkap: true,
                            email: true
                        }
                    },
                    room: {
                        select: {
                            id: true,
                            name: true,
                            capacity: true,
                            isOccupied: true
                        }
                    }
                },
                orderBy: {
                    startTime: 'asc'
                }
            });

            return { bookings };

        } catch (error) {
            return { error: "Terjadi kesalahan saat mengambil data booking" };
        }
    }, {
        query: t.Object({
            userId: t.Optional(t.String())
        }),
        detail: {
            tags: ['Bookings'],
            summary: 'Get All Bookings',
            description: 'Ambil semua booking atau filter berdasarkan userId',
            parameters: [
                {
                    name: 'userId',
                    in: 'query',
                    required: false,
                    schema: { type: 'string' },
                    description: 'Filter booking berdasarkan user ID',
                    example: '1'
                }
            ],
            responses: {
                200: {
                    description: 'Daftar booking berhasil diambil',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    bookings: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'number' },
                                                userId: { type: 'number' },
                                                roomId: { type: 'number' },
                                                startTime: { type: 'string', format: 'date-time' },
                                                endTime: { type: 'string', format: 'date-time' },
                                                user: { type: 'object' },
                                                room: { type: 'object' }
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

    // Get single booking by ID
    .get("/:id", async ({ params, set }) => {
        try {
            const booking = await db.booking.findUnique({
                where: { id: parseInt(params.id) },
                include: {
                    user: {
                        select: {
                            id: true,
                            nama_lengkap: true,
                            email: true
                        }
                    },
                    room: {
                        select: {
                            id: true,
                            name: true,
                            capacity: true,
                            isOccupied: true
                        }
                    }
                }
            });

            if (!booking) {
                set.status = 404;
                return { error: "Booking tidak ditemukan" };
            }

            return { booking };

        } catch (error) {
            set.status = 500;
            return { error: "Terjadi kesalahan saat mengambil data booking" };
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
        detail: {
            tags: ['Bookings'],
            summary: 'Get Booking by ID',
            description: 'Ambil detail booking berdasarkan ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID booking',
                    example: '1'
                }
            ],
            responses: {
                200: {
                    description: 'Detail booking berhasil diambil'
                },
                404: {
                    description: 'Booking tidak ditemukan'
                }
            }
        }
    });
