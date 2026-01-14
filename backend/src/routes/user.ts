import { Elysia, t } from "elysia";
import { db } from "../lib/db";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const userRoutes = new Elysia({ prefix: "/api/auth" })

  // ================= REGISTER =================
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const existingUser = await db.user.findUnique({
          where: { email: body.email },
        });

        if (existingUser) {
          set.status = 400;
          return { error: "Email sudah terdaftar" };
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await db.user.create({
          data: {
            nama_lengkap: body.nama_lengkap,
            email: body.email,
            password: hashedPassword,
            role: body.role ?? "USER",
          },
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            role: true,
          },
        });

        set.status = 201;
        return {
          message: "Registrasi berhasil",
          user,
        };
      } catch (err) {
        set.status = 500;
        return { error: "Gagal registrasi" };
      }
    },
    {
      body: t.Object({
        nama_lengkap: t.String(),
        email: t.String(),
        password: t.String(),
        role: t.Optional(t.String()),
      }),
    }
  )

  // ================= LOGIN =================
  .post("/login", async ({ body, set }) => {
  const { email, password } = body as {
    email: string;
    password: string;
  };

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    set.status = 401;
    return { error: "Email tidak terdaftar" };
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    set.status = 401;
    return { error: "Password salah" };
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    Bun.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
});
