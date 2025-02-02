import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

export const swaggerDocument = swagger({
  documentation: {
    info: {
      title: "BookDinn-API",
      version: "0.1.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "User", description: "Authentication endpoints" },
      { name: "Product", description: "Product endpoints" },
      { name: "Cart", description: "Cart endpoints" },
    ],
  },
});
