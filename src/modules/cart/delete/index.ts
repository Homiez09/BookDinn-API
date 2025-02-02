import { db } from "@/database/db";
import { middleware } from "@/middleware";
import Elysia, { error, t } from "elysia";

export const cart_delete = new Elysia({
  prefix: "/api/cart",
  detail: {
    tags: ["Cart"],
  },
})
  .use(middleware)
  .delete(
    "/:id",
    async ({ bearer, jwt, params }) => {
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

      await db.cartItem.deleteMany({
        where: {
          cartId: cart?.id,
        },
      });

      await db.cart.delete({
        where: {
          id: cart?.id,
        },
      });

      return { message: `Cart ID: ${params.id} deleted` };
    },
    {
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
