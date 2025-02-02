import { db } from "@/database/db";
import Elysia, { error, t } from "elysia";

export const product_delete = new Elysia({
  prefix: "api/product",
  detail: {
    tags: ["Product"],
  },
})
.delete(
  "/:id",
  async ({ params }) => {
    const productToDelete = await db.product.findUnique({
      where: { id: Number(params.id) },
    });

    if (!productToDelete) {
      return error("Not Found", {
        error: "Product not found",
        message: "Product not found",
      });
    }

    const deletedProduct = await db.product.delete({
      where: {
        id: Number(params.id),
      },
    });

    if (deletedProduct) {
      return error("OK", {
        message: "Product deleted successfully",
        data: deletedProduct,
      });
    }

    return error("Not Found", {
      error: "Product not found",
      message: "Product not found",
    });
  },
  {
    detail: {
      description: "Delete product",
      responses: {
        200: {
          description: "Successfully deleted the product",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    default: "Product deleted successfully",
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
