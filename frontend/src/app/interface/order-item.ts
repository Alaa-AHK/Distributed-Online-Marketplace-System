import { Product } from "./product";

export interface OrderItem {
  productId: Product;  
  quantity: number;
}
