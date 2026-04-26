// order.interface.ts
export interface Order {
  _id?: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    discountApplied?: number;
  }[];
  totalPrice: number;
}
