import { Elysia } from "elysia";
import {
  product_delete,
  product_get,
  product_post,
  product_put,
  sign_in,
  sign_up,
  cart_delete,
  cart_get,
  cart_post,
  cart_put,
  user_delete,
} from "./modules";
import { swaggerDocument } from "./swagger";

export const app = new Elysia()
  .use(swaggerDocument)
  .use(sign_in)
  .use(sign_up)
  .use(user_delete)

  .use(product_get)
  .use(product_post)
  .use(product_put)
  .use(product_delete)

  .use(cart_post)
  .use(cart_get)
  .use(cart_put)
  .use(cart_delete)

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
