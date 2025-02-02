import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";

export const middleware = new Elysia()
  .use(bearer())
  .use(
    jwt({
      secret: process.env.JWT_SECRET || "secret key",
    })
  );






  // .guard({
  //   beforeHandle({ bearer, set }) {
  //     if (!bearer) {
  //       set.status = 400;
  //       set.headers[
  //         "WWW-Authenticate"
  //       ] = `Bearer realm='sign', error="invalid_request"`;

  //       return "Unauthorized";
  //     }
  //   },
  // })
