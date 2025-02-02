// test/index.test.ts
import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "@/index";

const api = treaty(app).api;
let token: string;

describe("User Authentication", () => {
  it("should sign in with valid credentials", async () => {
    const res = await api.user["sign-in"].post({
      email: "admin@gmail.com", 
      password: "123456789",
    });
    token = res.data!;
    expect(res.data).toBeDefined();
  });

  it("should not sign in with invalid password", async () => {
    const res = await api.user["sign-in"].post({
      email: "admin@gmail.com", 
      password: "1234567890",
    });
    expect(res.status).toBe(401);
  });
});

describe("User", () => {});
