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
    "/",
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

      // check cart is own by user or not
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

    const newQuantity = cartItem?.quantity - body.quantity;

    if (newQuantity <= 0) {
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
        quantity: newQuantity,
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
