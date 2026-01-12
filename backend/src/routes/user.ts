import { Elysia, t } from 'elysia';
import { db } from '../lib/db';
import bcrypt from 'bcrypt';

export const userRoutes = new Elysia({ prefix: '/api/auth' })
    // --- REGISTER ---
    .post("/register", async ({ body, set }) => {
        try {
            // Cek apakah email sudah terdaftar
            const existingUser = await db.user.findUnique({
                where: { email: body.email }
            });

            if (existingUser) {
                set.status = 400;
                return { error: "Email sudah digunakan oleh akun lain" };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(body.password, 10);

            // Simpan ke database sesuai kolom 'nama_lengkap' di schema
            const newUser = await db.user.create({
                data: {
                    nama_lengkap: body.nama_lengkap,
                    email: body.email,
                    password: hashedPassword,
                    role: body.role || "STUDENT" // Default STUDENT jika tidak diisi
                },
                select: {
                    id: true,
                    nama_lengkap: true,
                    email: true,
                    role: true
                }
            });

            set.status = 201;
            return { message: "Registrasi berhasil", data: newUser };

        } catch (error) {
            set.status = 500;
            return { error: "Terjadi kesalahan sistem saat registrasi" };
        }
    }, {
        body: t.Object({
            nama_lengkap: t.String(),
            email: t.String(),
            password: t.String(),
            role: t.Optional(t.String())
        })
    })

    // --- LOGIN ---
    .post("/login", async ({ body, set }) => {
        try {
            // Cari user berdasarkan email
            const user = await db.user.findUnique({
                where: { email: body.email }
            });

            if (!user) {
                set.status = 404;
                return { error: "User tidak ditemukan" };
            }

            // Verifikasi password
            const isMatch = await bcrypt.compare(body.password, user.password);
            if (!isMatch) {
                set.status = 401;
                return { error: "Password salah" };
            }

            // Berhasil login
            return {
                message: "Login berhasil",
                user: {
                    id: user.id,
                    nama_lengkap: user.nama_lengkap,
                    email: user.email,
                    role: user.role
                }
            };

        } catch (error) {
            set.status = 500;
            return { error: "Terjadi kesalahan sistem saat login" };
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    });