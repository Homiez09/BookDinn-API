import { db } from "@/database/db";
import { StatusCode } from "@/interfaces/statusCode";
import { middleware } from "@/middleware";
import Elysia, { error, t } from "elysia";

export const sign_up = new Elysia({
  prefix: "/api/user",
  detail: {
    tags: ["User"],
  },
})
  .model({
    "user.sign-up": t.Object({
      email: t.String(),
      password: t.String(),
    }),
    "user.give-admin": t.Object({
      email: t.String(),
    }),
  })
  .post(
    "/sign-up",
    async ({ body }) => {
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

      const newUser = await db.user.create({
        data: {
          email: body.email,
          password: body.password, // ยังไม่ได้ทำ hash word
        },
      });

      return error("Created", {
        message: "User created successfully",
        data: newUser,
      });
    },
    {
      body: "user.sign-up",
      error({ code }: StatusCode) {
        switch (code) {
          case "P2002":
            return {
              error: "Email already taken",
              message: "This email is already taken",
            };
          default:
            return {
              status: 500,
              message: "Internal server error",
            };
        }
      },
      detail: {
        description: "Sign up",
        responses: {
          201: {
            description: "Successfully created the user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      default: "User created successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        email: {
                          type: "string",
                        },
                        role: {
                          type: "string",
                        },
                      },
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
          },
        }
      }
    }
  )
  .post(
    "/give-admin",
    async ({ body }) => {
      const user = await db.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return error("Not Found", {
          error: "User not found",
          message: "User not found",
        });
      }

      if (user.role === "ADMIN") {
        return error("Bad Request", {
          error: "User is already an admin",
          message: "User is already an admin",
        });
      }

      const updatedUser = await db.user.update({
        where: {
          email: body.email,
        },
        data: {
          role: "ADMIN",
        },
      });

      return error("OK", {
        message: "User is now an admin",
        data: updatedUser,
      });
    },
    {
      body: "user.give-admin",
      detail: {
        description: "Give user admin role",
        responses: {
          200: {
            description: "Successfully give user admin role",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      default: "User is now an admin",
                    },
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        email: {
                          type: "string",
                        },
                        role: {
                          type: "string",
                        },
                      },
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
                      default: "User is already an admin",
                    },
                    message: {
                      type: "string",
                      default: "User is already an admin",
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
  );
