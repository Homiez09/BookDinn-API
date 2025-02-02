import { db } from "@/database/db";
import Elysia, { error, t } from "elysia";

export const product_get = new Elysia({
  prefix: "/api/product",
  detail: {
    tags: ["Product"],
  },
})
  .get(
    "/",
    async ({ query }) => {
      if (query.search) {
        const products = await db.product.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: query.search,
                },
              },
              {
                description: {
                  contains: query.search,
                },
              },
            ],
          },
        });

        return products;
      }

      const products = await db.product.findMany();
      return products;
    },
    {
      detail: {
        description: "Get all products",
        responses: {
          200: {
            description: "Successfully retrieved all products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
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
      },
    }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const product = await db.product.findFirst({
        where: {
          id: Number(params.id),
        },
      });

      if (!product) {
        return error("Not Found", {
          error: "Product not found",
          message: "Product not found",
        });
      }

      return product;
    },
    {
      detail: {
        description: "Get product by ID",
        responses: {
          200: {
            description: "Successfully retrieved the product",
            content: {
              "application/json": {
                schema: {
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
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      default: "Product not found",
                    },
                    message: {
                      type: "string",
                      default: "Product not found",
                    },
                  },
                },
              },
            },
          }
        },
      },
    }
  );
