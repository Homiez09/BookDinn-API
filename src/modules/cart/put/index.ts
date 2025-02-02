import { db } from "@/database/db";
import { middleware } from "@/middleware";
import Elysia, { error, t } from "elysia";

export const cart_put = new Elysia({
  prefix: "/api/cart",
  detail: {
    tags: ["Cart"],
  },
})
  .model({
    "cartItem.delete": t.Object({
      cartItemId: t.Number(),
      quantity: t.Number(),
    }),
  })
  .use(middleware)
  .put(
    "/update",
    async ({ bearer, jwt, body }) => {
      const verifyJwt = (await jwt.verify(bearer)) as {
        id: string;
        email: string;
        expired: number;
      };
      if (!verifyJwt) {
        return error("Unauthorized", {
          error: "Unauthorized",
          message: "Unauthorized",
        });
      }

      const cart = await db.cart.findFirst({
        where: {
          userId: verifyJwt.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const cartItem = await db.cartItem.findUnique({
        where: {
          id: body.cartItemId,
          cartId: cart?.id,
        },
      });

      if (!cartItem) {
        return error("Not Found", {
          error: "Cart item not found",
          message: "Cart item not found",
        });
      }

    if (body.quantity <= 0) {
      await db.cartItem.delete({
        where: {
        id: body.cartItemId,
        },
      });

      return {
        message: "Cart item deleted successfully",
      };
    } else {
      const updatedCartItem = await db.cartItem.update({
        where: {
        id: body.cartItemId,
        },
        data: {
        quantity: body.quantity,
        },
      });

      return {
        message: "Cart item updated successfully",
        data: updatedCartItem,
      };
    }
    },
    {
      body: "cartItem.delete",
      detail: {
        description: "Delete cart item",
        responses: {
          200: {
            description: "Successfully deleted the cart item",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      default: "Cart item deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Cart item not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      default: "Cart item not found",
                    },
                    message: {
                      type: "string",
                      default: "Cart item not found",
                    },
                  },
                },
              },
            },
          },
        }
      },
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
