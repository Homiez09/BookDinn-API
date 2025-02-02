import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import {
  product_delete,
  product_get,
  product_post,
  product_put,
} from "./modules";
import { sign_in, sign_up } from "./modules/user";
import { middleware } from "./middleware";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "BookDinn-API",
          version: "0.1.0",
        },
        tags: [{ name: "App", description: "General endpoints" }],
      },
    })
  )
  .use(sign_in)
  .use(sign_up)
  .use(product_get)
  .use(product_post)
  .use(product_put)
  .use(product_delete)
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
