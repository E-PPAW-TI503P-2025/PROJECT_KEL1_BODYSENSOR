import { Elysia, t } from 'elysia';
import { db } from '../lib/db';

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
    })

    // Update ruangan
    .put("/rooms/:id", async ({ params, body }) => {
        try {
            const room = await db.room.update({
                where: { id: parseInt(params.id) },
                data: body
            });
            return room;
        } catch (error) {
            return { error: "Room tidak ditemukan atau gagal update" };
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.Optional(t.String()),
            capacity: t.Optional(t.Number()),
            deviceId: t.Optional(t.String()),
            isOccupied: t.Optional(t.Boolean())
        }),
        detail: {
            tags: ['Admin'],
            summary: 'Update Room',
            description: 'Update data ruangan berdasarkan ID (Admin Only)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID ruangan yang akan diupdate',
                    example: '1'
                }
            ],
            requestBody: {
                description: 'Data yang akan diupdate (semua field optional)',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Ruang Meeting B'
                                },
                                capacity: {
                                    type: 'number',
                                    example: 15
                                },
                                deviceId: {
                                    type: 'string',
                                    example: 'ESP32_002'
                                },
                                isOccupied: {
                                    type: 'boolean',
                                    example: false
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Ruangan berhasil diupdate',
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
                },
                404: {
                    description: 'Room tidak ditemukan',
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

    // Delete ruangan
    .delete("/rooms/:id", async ({ params }) => {
        try {
            const room = await db.room.delete({
                where: { id: parseInt(params.id) }
            });
            return { message: `Room ${room.name} berhasil dihapus`, deletedRoom: room };
        } catch (error) {
            return { error: "Room tidak ditemukan atau gagal hapus" };
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
        detail: {
            tags: ['Admin'],
            summary: 'Delete Room',
            description: 'Hapus ruangan berdasarkan ID (Admin Only)',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID ruangan yang akan dihapus',
                    example: '1'
                }
            ],
            responses: {
                200: {
                    description: 'Ruangan berhasil dihapus',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    deletedRoom: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number' },
                                            name: { type: 'string' },
                                            capacity: { type: 'number' },
                                            deviceId: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Room tidak ditemukan',
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

