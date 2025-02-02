import { db } from "@/database/db";
import { middleware } from "@/middleware";
import Elysia, { error, t } from "elysia";

export const cart_get = new Elysia({
  prefix: "/api/cart",
  detail: {
    tags: ["Cart"],
  },
})
  .use(middleware)
  .get(
    "/",
    async ({ bearer, jwt }) => {
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

      const cart = await db.cart.findFirst({
        where: {
          userId: verifyJwt.id,
        },
        orderBy: {
            createdAt: "desc",
          },
        
      });

      if (!cart) {
        return error("Not Found", {
          error: "Cart not found",
          message: "Cart not found",
        });
      }

      const cartItems = await db.cartItem.findMany({
        where: {
          cartId: cart.id,
        },
      });

      return {
        ...cart, cartItems: cartItems
      };
    },
    {
      detail: {
        tags: ["Cart"],
        security: [
          {
            bearerAuth: ["cart.post"],
          },
        ],
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
