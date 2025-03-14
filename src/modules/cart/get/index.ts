import { db } from "@/database/db";
import { calculateHarryDiscount } from "@/libs/calculateHarryDiscount";
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
    "/getAll",
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
        include: {
          CartItems: {
            include: {
              Product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const discount = calculateHarryDiscount(cart!);
      const beforeAmount = cart?.CartItems.reduce((acc, curr) => acc + curr.Product.price * curr.quantity, 0) || 0;

      return { data: cart, meta: {
        total: cart?.CartItems.reduce((acc, curr) => acc + curr.quantity, 0) || 0, 
        beforeDiscount: cart?.CartItems.reduce((acc, curr) => acc + curr.Product.price * curr.quantity, 0) || 0,
        discount: discount,
        totalAmount: beforeAmount - (discount),
      } };
    },
    {
      detail: {
        tags: ["Cart"],
        security: [
          {
            bearerAuth: ["cart.post"],
          },
        ],
        description: "Get all cart",
        responses: {
          200: {
            description: "Successfully retrieved the cart",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        userId: {
                          type: "string",
                        },
                        CartItems: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: {
                                type: "number",
                              },
                              productId: {
                                type: "number",
                              },
                              quantity: {
                                type: "number",
                              },
                              Product: {
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
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: {
                          type: "number",
                        },
                        beforeDiscount: {
                          type: "number",
                        },
                        discount: {
                          type: "number",
                        },
                        totalAmount: {
                          type: "number",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      default: "Unauthorized",
                    },
                    message: {
                      type: "string",
                      default: "Unauthorized",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      default: "Not Found",
                    },
                    message: {
                      type: "string",
                      default: "Not Found",
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
