import { db } from "@/database/db";
import { middleware } from "@/middleware";
import Elysia, { error, t } from "elysia";

export const cart_post = new Elysia({
  prefix: "/api/cart",
  detail: {
    tags: ["Cart"],
  },
})
  .model({
    "cart.post": t.Object({
      productId: t.Number(),
      quantity: t.Number(),
    }),
  })
  .use(middleware)
  .post(
    "/",
    async ({ body, bearer, jwt }) => {
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

      if (!verifyJwt.id) {
        return error("Not Found", {
          error: "wrong token",
          message: "wrong token",
        });
      }

      if (body.quantity < 1) {
        return error("Bad Request", {
          error: "Invalid quantity",
          message: "Quantity cannot be less than 1",
        });
      }

      const user = await db.user.findUnique({
        where: {
          id: verifyJwt.id,
        },
      });

      if (!user) {
        return error("Not Found", {
          error: "User not found",
          message: "User not found",
        });
      }

      const product = await db.product.findUnique({
        where: {
          id: Number(body.productId),
        },
      });

      if (!product) {
        return error("Not Found", {
          error: "Product not found",
          message: "Product not found",
        });
      }

      if (product.remaining < body.quantity) {
        return error("Bad Request", {
          error: "Invalid quantity",
          message: "Quantity exceeds the remaining stock",
        });
      }

      const cart = await db.cart.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!cart || cart.isPaid) {
        const newCart = await db.cart.create({
          data: {
            userId: user.id,
            CartItems: {
              create: [
                {
                  productId: product.id,
                  quantity: body.quantity,
                },
              ],
            },
          },
        });

        return error("OK", {
          message: "Cart created successfully",
          data: newCart,
        });
      } else {
        const cartItem = await db.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId: product.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (cartItem) {
          const updatedCartItem = await db.cartItem.update({
            where: {
              id: cartItem.id,
            },
            data: {
              quantity: cartItem.quantity + body.quantity,
            },
          });

          return error("OK", {
            message: "Cart updated successfully",
            data: updatedCartItem,
          });
        } else {
          const newCartItem = await db.cartItem.create({
            data: {
              cartId: cart.id,
              productId: product.id,
              quantity: body.quantity,
            },
          });

          return error("OK", {
            message: "Cart created successfully",
            data: newCartItem,
          });
        }
      }
    },
    {
      body: "cart.post",
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
