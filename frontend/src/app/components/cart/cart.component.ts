import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
   productsCart: any[] = [];
   isLoading:boolean=true;
  constructor(private _CartService:CartService,private router:Router,private _OrderService:OrderService){}
checkout() {
  this._CartService.getCart().subscribe({
    next: (res: any) => {
      console.log('Cart response in checkout:', res);

      let items = [];
      if (res?.cart?.items && Array.isArray(res.cart.items)) {
        items = res.cart.items;
      } else if (Array.isArray(res)) {
        items = res;
      }
      if (items.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      this._CartService.setCheckoutItems(items);
      this.router.navigate(['/order']);
    },
    error: (err) => {
      console.error('Error fetching cart:', err);
      alert("Failed to fetch cart!");
    }
  });
}



  getCart() {
  this.isLoading = true;
  this._CartService.getCart().subscribe({
    next: (res: any) => {
      console.log('Cart response:', res);

      
      if (res?.cart?.items && Array.isArray(res.cart.items)) {
        this.productsCart = res.cart.items;
      } 
      
      else if (Array.isArray(res)) {
        this.productsCart = res;
      } 
      else {
        this.productsCart = [];
      }
    },
    error: (err) => {
      console.error('Error fetching cart:', err);
      this.productsCart = []; 
    },
    complete: () => {
      this.isLoading = false;
      console.log('Cart fetch complete');
    }
  });
}


  cartCreate = new FormGroup({
    productId: new FormControl('', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)])
  });
  sendData(){
    if(this.cartCreate.valid){
      this._CartService.postCart(this.cartCreate.value).subscribe({
        next:(res)=>{console.log(res);
          this.getCart()
        },
        error:(err)=>{console.log(err)},
        complete:()=>{console.log("complete")}
      })
    }
  }
 deleteItem(productId: string) {
  this._CartService.deleteItemInCart(productId).subscribe({
    next: (res) => {
      console.log(res);
      this.getCart();
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {
      console.log("complete");
    }
  });
}

  updateCartQuan(itemId: string, updatedQuantity: number) {
  if (updatedQuantity < 1) {
    return;
  }

  this._CartService.updateCartQuantity(itemId, updatedQuantity).subscribe({
    next: (res) => {
      console.log("Quantity updated:", res);
      this.getCart(); 
    },
    error: (err) => {
      console.error("Error updating quantity:", err);
    },
    complete: () => {
      console.log("Update quantity complete");
    }
  });
}

  getTotal() {
  if (!this.productsCart || this.productsCart.length === 0) {
    return 0;
  }

  return this.productsCart.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);
}


goToCheckout() {
  this.router.navigate(['/checkout']);
}
deleteAllCart(){
  this._CartService.deleteAllCart().subscribe({
    next: (res) => {
      console.log(res);
      this.getCart();
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {
      console.log("complete");
    }
  });
}
ngOnInit() {
  this.getCart();
}

  


}
