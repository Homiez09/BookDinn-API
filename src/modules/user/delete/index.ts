import { db } from "@/database/db";
import { middleware } from "@/middleware";
import Elysia, { error, t } from "elysia";

export const user_delete = new Elysia({
  prefix: "/api/user",
  detail: {
    tags: ["User"],
  },
})
  .model({
    "user.delete": t.Object({
      id: t.String(),
    }),
  })
  .use(middleware)
  .delete(
    "/delete",
    async ({ body, bearer, jwt }) => {
      const verifyJwt = (await jwt.verify(bearer)) as {
        id: string;
        email: string;
        role: string;
        expired: number;
      };

      if (!verifyJwt) {
        return error("Unauthorized", {
          error: "Unauthorized",
          message: "Unauthorized",
        });
      }

      const user = await db.user.findUnique({
        where: {
          id: body.id,
        },
      });

      if (!user || user.role !== "ADMIN") {
        return error("Unauthorized", {
          error: "User not found",
          message: "User not found",
        });
      }

      await db.user.delete({
        where: {
          id: user.id,
        },
      });

      return { message: `User ID: ${user.id} deleted` };
    },
    {
      body: "user.delete",
      beforeHandle({ bearer, set }) {
        if (!bearer) {
          set.status = 400;
          set.headers[
            "WWW-Authenticate"
          ] = `Bearer realm='sign', error="invalid_request"`;
          return "Unauthorized";
        }
      },
    }
  );
