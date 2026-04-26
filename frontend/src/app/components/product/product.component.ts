import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { DataService } from '../../Services/data.service';
import { ProductService } from '../../Services/product.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  products: any[] = [];
  showCreateForm: boolean = false;
  addAdmin: boolean = false;

toggleAddAdmin() {
  this.addAdmin = !this.addAdmin;
}
  constructor(private _ProductService:ProductService,private router:Router,private _CartService:CartService){}
 

getProducts() {
  this._ProductService.getproducts().subscribe({
    next: (res: any) => { 
      console.log(res); 
      this.products = res.products; 
    },
    error: (err) => console.log(err),
    complete: () => console.log("complete")
  });
}

    productCreate=new FormGroup({
      name:new FormControl(null,[Validators.required]),
      description: new FormControl(null,[Validators.required]),
      discount:new FormControl(0) ,
      price: new FormControl(null,[Validators.required]),
      image:new FormControl(null,[Validators.required])
    })
sendData(){
  if(this.productCreate.valid){
    this._ProductService.postProduct(this.productCreate.value).subscribe({
      next:(res)=>{
        console.log(res);
        
        const token = localStorage.getItem("Authorization");
        if (token && token.startsWith('Bearer ')) {
          try {
            const tokenValue = token.replace('Bearer ', '');
            const payload = JSON.parse(atob(tokenValue.split(".")[1]));
            this.userRole = payload.role; 
          } catch (e) {
            console.error("Invalid token", e);
            this.userRole = "customer";
          }
        } else {
          this.userRole = "customer";
        }

        this.showCreateForm = false;
        this.getProducts();  
      },
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("complete")}
    })
  }
}

deleteProduct(id: string) {
  this._ProductService.deleteProduct(id).subscribe({
    next: (res) => {
      localStorage.setItem("Authorization", 'Bearer ' + res.token);
      console.log("Deleted successfully", res);
      this.getProducts(); 
    },
    error: (err) => console.log(err)
  });
}


updateProduct(id: string, updatedData: any) {
  this._ProductService.updateProduct(id, updatedData).subscribe({
    next: (res) => {
      localStorage.setItem("Authorization", 'Bearer ' + res.token);
      console.log("Updated successfully", res);
      this.getProducts(); 
    },
    error: (err) => console.log(err)
  });
} 


userRole: string = '';

ngOnInit(): void {
    const token = localStorage.getItem('Authorization');

    if (token && token.startsWith('Bearer ')) {
      try {
        const tokenValue = token.replace('Bearer ', '');
        const parts = tokenValue.split('.');

        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          this.userRole = payload.role || null;
        } else {
          console.warn('Invalid JWT format');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No valid token found in localStorage');
    }

    this.getProducts();
  }
addToCart(product: any, event: Event) {
    event.preventDefault();

    const token = localStorage.getItem('Authorization'); // Bearer token

    if (!token) {
      alert('Please log in first!');
      this.router.navigate(['/login']);
      return;
    }

    const cartData = {
      productId: product._id,
      quantity: 1
    };

    this._CartService.postCart(cartData).subscribe({
      next: (res) => {
        console.log('Cart updated:', res);
         
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  }
goToUpdatePage(id: string) {
  this.router.navigate(['/update-product', id]);
}



  }


