import { db } from "@/database/db";
import Elysia, { error, t } from "elysia";

export const product_put = new Elysia({
  prefix: "api/product",
  detail: {
    tags: ["Product"],
  },
})
  .model({
    "product.update": t.Object({
      title: t.String(),
      description: t.String(),
      price: t.Number(),
      promotion: t.Boolean(),
      remaining: t.Number(),
    }),
  })
  .put(
    "/:id",
    async ({ params, body }) => {
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

      const updatedProduct = await db.product.update({
        where: {
          id: Number(params.id),
        },
        data: {
          title: body.title,
          description: body.description,
          price: body.price,
          promotion: body.promotion,
          remaining: body.remaining,
        },
      });

      if (updatedProduct) {
        return error("OK", {
          message: "Product updated successfully",
          data: updatedProduct,
        });
      }

      return error("Not Found", {
        error: "Product not found",
        message: "Product not found",
      });
    },
    {
      body: "product.update",
      detail: {
        description: "Update product by ID",
        responses: {
          200: {
            description: "Successfully updated the product",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      default: "Product updated successfully",
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
        },
      },
    }
  );
