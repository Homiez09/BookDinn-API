// if you want to create a new user.
import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "@/index";

const api = treaty(app).api;

describe.skip("User", () => {
  it("should return 201", async () => {
    const res = await api.user["sign-up"].post({
      email: "user1@gmail.com", // don't forget to change this
      password: "123456789",
    });
    expect(res.status).toBe(201);
  });
});