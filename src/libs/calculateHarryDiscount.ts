export const calculateHarryDiscount = (cart: any) => {
  let uniqueBookTemp: number[] = [0, 0, 0, 0, 0, 0, 0];
  let originalPrice = 0;

  let i = 0;

  for (const item of cart.CartItems) {
    if (item.Product.promotion) {
      uniqueBookTemp[i] = item.quantity;
      originalPrice += item.Product.price * item.quantity;
      i++;
    }
  }

  let uniqueBook = uniqueBookTemp.filter((book) => book > 0);

  const discounts = {
    2: 0.1,
    3: 0.2,
    4: 0.3,
    5: 0.4,
    6: 0.5,
    7: 0.6,
  } as Record<number, number>;

  let discountNum = 0;

  while (uniqueBook.length > 1) {
    let uniqueBooksCount = uniqueBook.length;
    for (const tier in uniqueBook) {
      if (uniqueBook[tier] > 0) {
        uniqueBook[tier]--;
      }
    }
    
    discountNum += uniqueBooksCount * 100 * discounts[uniqueBooksCount] ;
    uniqueBook = uniqueBook.filter((book) => book > 0);
  }

  return discountNum;
};
