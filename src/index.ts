import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import {
  product_delete,
  product_get,
  product_post,
  product_put,
} from "./modules";
import { sign_in, sign_up } from "./modules/user";
import { cart_post } from "./modules/cart/post";
import { swaggerDocument } from "./swagger";
import { cart_get } from "./modules/cart/get";
import { cart_put } from "./modules/cart/put";
import { cart_delete } from "./modules/cart/delete";

export const app = new Elysia()
  .use(swaggerDocument)
  .use(sign_in)
  .use(sign_up)

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
