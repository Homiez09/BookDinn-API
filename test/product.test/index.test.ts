import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "@/index";

const api = treaty(app).api;
let token: string;
let product;

describe("Cart Route", () => {
  beforeAll(async () => {
    const randomStr = 'admintest'
    const testUserSignUp = await api.user["sign-in"].post({
      email: randomStr + "@gmail.com",
      password: "123456789",
    });

    const giveAdminRole = await api.user["give-admin"].post({
      email: randomStr + "@gmail.com",
    });

    const testUserSignIn = await api.user["sign-in"].post({
      email: randomStr + "@gmail.com",
      password: "123456789",
    });

    token = testUserSignIn.data!;
  });

  afterAll(async () => {
    
  });
});