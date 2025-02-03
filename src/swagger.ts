import swagger from "@elysiajs/swagger";

export const swaggerDocument = swagger({
  documentation: {
    info: {
      title: "BookDinn-API",
      version: "0.1.5",
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
