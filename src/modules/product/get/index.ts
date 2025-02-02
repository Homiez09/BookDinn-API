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
      let products = null;
      
      if (query.page) {
        products = await db.product.findMany({
          skip: (Number(query.page) - 1) * 8,
          take: 8,
        });
      } else {
        products = await db.product.findMany({
          take: 8,
        });
      }

      return {
        data: products,
        meta: {
          pagination: {
            page: query.page || 1,
            pageSize: 8,
            pageCount: Math.ceil(products.length / 8),
            total: products.length,
          },
        },
      };
    },
    {
      detail: {
        description: "Get all products",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number for pagination",
            required: false,
            schema: {
              type: "integer",
              example: 1, // ตัวอย่างค่า
            },
          },
        ],
        responses: {
          200: {
            description: "Successfully retrieved all products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
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
                    meta: {
                      type: "object",
                      properties: {
                        pagination: {
                          type: "object",
                          properties: {
                            page: {
                              type: "number",
                            },
                            pageSize: {
                              type: "number",
                            },
                            pageCount: {
                              type: "number",
                            },
                            total: {
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
          },
        },
      },
    }
  );
