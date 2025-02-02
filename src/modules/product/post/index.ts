import { db } from "@/database/db";
import { StatusCode } from "@/interfaces/statusCode";
import Elysia, { error, t } from "elysia";

export const product_post = new Elysia({
  prefix: "/api/product",
  detail: {
    tags: ["Product"],
  },
})
  .model({
    "product.create": t.Object({
      title: t.String(),
      description: t.Optional(t.String()),
      price: t.Number(),
      promotion: t.Optional(t.Boolean()),
      remaining: t.Number(),
      // todo: เพิ่ม picture_url, author ภายหลัง
    }),
  })
  .post(
    "/create",
    async ({ body }) => {
      if (body.title.length < 3) {
        return error("Bad Request", {
          error: "Invalid title",
          message: "Title cannot be empty",
        });
      }

      if (body.remaining < 0) {
        return error("Internal Server Error", {
          error: "Invalid remaining value",
          message: "Remaining cannot be less than 0",
        });
      }

      if (body.price < 0) {
        return error("Internal Server Error", {
          error: "Invalid price value",
          message: "Price cannot be less than 0",
        });
      }

      const newProduct = await db.product.create({
        data: {
          title: body.title,
          description: body.description,
          price: body.price,
          promotion: body.promotion,
          remaining: body.remaining,
        },
      });

      return error("Created", {
        message: "Product created successfully",
        data: newProduct,
      });
    },
    {
      error({ code }: StatusCode) {
        switch (code) {
          case "P2002":
            return {
              error: "Unique constraint violation",
              message: "Product title must be unique",
            };
          default:
            return {
              error: "Internal server error",
              message: "Internal server error",
            };
        }
      },
      body: "product.create", detail: {
        description: "Create new product",
        responses: {
          201: {
            description: "Successfully created the product",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      default: "Product created successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        title: {
                          type: "string",
                        },
                        description: {
                          type: "string",
                        },
                        price: {
                          type: "number",
                        },
                        remaining: {
                          type: "number",
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
                      default: "Invalid title",
                    },
                    message: {
                      type: "string",
                      default: "Title cannot be empty",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      default: "Internal server error",
                    },
                    message: {
                      type: "string",
                      default: "Internal server error",
                    },
                  },
                },
              },
            },
          },
        },
      }
    }
  );
