import { Elysia } from "elysia";
import jwt from "jsonwebtoken";
import { db } from "../lib/db";

export const dashboardRoutes = new Elysia({
  prefix: "/api/dashboard",
})

  .get("/", async ({ headers, set }) => {
    try {
      const auth = headers.authorization;

      if (!auth) {
        set.status = 401;
        return { error: "Token tidak ditemukan" };
      }

      const token = auth.split(" ")[1];

      const payload = jwt.verify(
        token,
        Bun.env.JWT_SECRET!
      ) as {
        id: number;
        email: string;
        role: string;
      };

      // =====================
      // ADMIN DASHBOARD
      // =====================
      if (payload.role === "ADMIN") {
        const totalUser = await db.user.count();

        return {
          role: "ADMIN",
          message: "Dashboard Admin",
          data: {
            totalUser,
            email: payload.email,
          },
        };
      }

      // =====================
      // USER / STUDENT DASHBOARD
      // =====================
      return {
        role: "STUDENT",
        message: "Dashboard User",
        data: {
          id: payload.id,
          email: payload.email,
        },
      };
    } catch {
      set.status = 401;
      return { error: "Token tidak valid" };
    }
  });
