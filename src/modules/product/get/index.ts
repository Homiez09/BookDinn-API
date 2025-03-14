import { db } from "@/database/db";
import Elysia, { error } from "elysia";

export const product_get = new Elysia({
  prefix: "/api/product",
  detail: {
    tags: ["Product"],
  },
})
  .get(
    "/getByPage",
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

      const pageCount = (await db.product.findMany()).length;

      return {
        data: products,
        meta: {
          pagination: {
            page: query.page || 1,
            pageSize: 8,
            pageCount: Math.ceil(pageCount / 8),
            total: products.length,
          },
        },
      };
    },
    {
      detail: {
        description: "Get all products",
        detail: {
          desctiprion: "Get all products by page",
        }, 
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number for pagination",
            required: false,
            schema: {
              type: "integer",
              example: 1,
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
      const product = await db.product.findUnique({
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
  )
  .get('/getByPromotion', async () => {
    const products = await db.product.findMany({
      where: {
        promotion: true,
      },
    });

    return products;
  }, {
    detail: {
      description: "Get all products with promotion",
      responses: {
        200: {
          description: "Successfully retrieved all products with promotion",
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
  });
