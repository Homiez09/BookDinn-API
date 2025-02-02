import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "@/index";

const api = treaty(app).api;
const randomStr = Math.random().toString(36).substring(7);
let token: string;
let user: any;
let productList: any[] = [];

describe("User", () => {
  beforeAll(async () => {
    const testUserSignUp = await api.user["sign-up"].post({
      email: randomStr + "@gmail.com",
      password: "123456789",
    });

    user = testUserSignUp.data;
    user = user.data;

    const giveAdminRole = await api.user["give-admin"].post({
      email: randomStr + "@gmail.com",
    });

    const testUserSignIn = await api.user["sign-in"].post({
      email: randomStr + "@gmail.com",
      password: "123456789",
    });

    token = testUserSignIn.data!;

    for (let i = 0; i < 7; i++) {
      const testProduct = await api.product.create.post(
        {
          title: "Harry Potter " + i,
          description: "",
          price: 100,
          promotion: true,
          remaining: 500,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    for (let i = 0; i < 7; i++) {
      const testProduct = await api.product.create.post(
        {
          title: "Transformers " + i,
          description: "",
          price: 100,
          promotion: false,
          remaining: 500,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  });

  afterAll(async () => {
    const removeUser = await api.user["delete"].delete(
      {
        id: user.id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it("(1) ซื้อ แฮร์รี พอตเตอร์กับศิลาอาถรรพ์ 2 เล่ม กับ แฮร์รี พอตเตอร์กับ ห้องแห่งความลับ 1 เล่ม รวม 3 เล่ม ราคารวม 300 บาท ส่วนลด 20 บาท รวมสุทธิ 280 บาท", async () => {
    const buyHarryPotter = await api.cart.add.post(
      {
        productId: 1,
        quantity: 2,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const buyHarryPotter2 = await api.cart.add.post(
      {
        productId: 2,
        quantity: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.meta.totalAmount).toEqual(280);
    expect(cart.data?.data?.isPaid).toEqual(false);
  });

  it("(1) จ่ายเงิน และสถานะในตระกร้าเปลี่ยน", async () => {
    const pay = await api.cart.pay.post(
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.data?.isPaid).toEqual(true);
  });

  it("(2) ซื้อ แฮรี พอตเตอร์กับห้องแห่งความลับ 3 เล่ม กับ แฮรี พอตเตอร์ กับถ้วยอัคนี 3 เล่ม รวม 6 เล่ม ราคารวม 600 บาท ส่วนลด 60 บาท รวมสุทธิ 540 บาท", async () => {
    const buyHarryPotter = await api.cart.add.post(
      {
        productId: 2,
        quantity: 3,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const buyHarryPotter2 = await api.cart.add.post(
      {
        productId: 3,
        quantity: 3,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.meta.totalAmount).toEqual(540);
    expect(cart.data?.data?.isPaid).toEqual(false);
  });

  it("(2) จ่ายเงิน และสถานะในตระกร้าเปลี่ยน", async () => {
    const pay = await api.cart.pay.post(
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.data?.isPaid).toEqual(true);
  });

  it("(3) ซื้อ แฮรี พอตเตอร์กับศิลาอาถรรพ์ 1 เล่ม กับ แฮรี พอตเตอร์กับ ห้องแห่งความลับ 1 เล่ม กับ แฮรี พอตเตอร์กับถ้วยอัคนี 1 เล่ม รวม 3 เล่ม ราคารวม 300 บาท ส่วนลด 60 บาท รวมสุทธิ 240 บาท", async () => {
    const buyHarryPotter = await api.cart.add.post(
      {
        productId: 1,
        quantity: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const buyHarryPotter2 = await api.cart.add.post(
      {
        productId: 2,
        quantity: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const buyHarryPotter3 = await api.cart.add.post(
      {
        productId: 3,
        quantity: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.meta.totalAmount).toEqual(240);
    expect(cart.data?.data?.isPaid).toEqual(false);
  });

  it("(4) จ่ายเงิน และสถานะในตระกร้าเปลี่ยน", async () => {
    const pay = await api.cart.pay.post(
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.data?.isPaid).toEqual(true);
  });

  it("(4) ซื้อ แฮรี พอตเตอร์กับศิลาอาถรรพ์ 10 เล่ม รวม 10 เล่ม ราคารวม 1000 บาท ส่วนลด 0 บาท รวมสุทธิ 1000 บาท", async () => {
    const buyHarryPotter = await api.cart.add.post(
      {
        productId: 1,
        quantity: 10,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.meta.totalAmount).toEqual(1000);
    expect(cart.data?.data?.isPaid).toEqual(false);
  });

  it("(4) จ่ายเงิน และสถานะในตระกร้าเปลี่ยน", async () => {
    const pay = await api.cart.pay.post(
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const cart = await api.cart.getAll.get({
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(cart.data?.data?.isPaid).toEqual(true);
  });
});