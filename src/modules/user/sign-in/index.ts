import { db } from "@/database/db";
import { middleware } from "@/middleware";
import Elysia, { error, t } from "elysia";

export const sign_in = new Elysia({
  prefix: "/api/user",
  detail: {
    tags: ["User"],
  },
})
  .use(middleware)
  .model({
    "user.sign-in": t.Object({
      email: t.String(),
      password: t.String(),
    }),
  })
  .post(
    "/sign-in",
    async ({ body, jwt }) => {
      if (body.email.length < 3 || !body.email.includes("@")) {
        return error("Bad Request", {
          error: "Invalid email",
          message: "Email must be valid",
        });
      }

      if (body.password.length < 3) {
        return error("Bad Request", {
          error: "Invalid password",
          message: "Password must be at least 3 characters",
        });
      }

      const user = await db.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return error("Unauthorized", {
          error: "User not found",
          message: "User not found",
        });
      }

      if (user.password !== body.password) {
        return error("Unauthorized", {
          error: "Invalid password",
          message: "Invalid password",
        });
      }

      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        expire: Math.floor(Date.now() / 1000) + 86400,
      });

      return token;
    },
    {
      body: "user.sign-in",
      detail: {
        description: "Sign in",
        responses: {
          200: {
            description: "Successfully signed in",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      default: "Invalid email",
                    },
                    message: {
                      type: "string",
                      default: "Email must be valid",
                    },
                  },
                },
              },
            },
          }
        },
      }
    }
  );
