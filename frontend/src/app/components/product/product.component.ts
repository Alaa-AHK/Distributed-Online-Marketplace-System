import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  showCreateForm = false;

  constructor(
    private _ProductService: ProductService,
    private router: Router,
    private _CartService: CartService
  ) {}

  productCreate = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    price: new FormControl(null, [Validators.required]),
    quantity: new FormControl(1, [Validators.required]),
    discount: new FormControl(0),
    image: new FormControl(null)
  });

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this._ProductService.getproducts().subscribe({
      next: (res) => {
        this.products = res.products;
      },
      error: (err) => console.log(err)
    });
  }

  sendData() {
    if (this.productCreate.valid) {
      this._ProductService.postProduct(this.productCreate.value).subscribe({
        next: () => {
          this.showCreateForm = false;
          this.getProducts();
        },
        error: (err) => console.log(err)
      });
    }
  }

  deleteProduct(id: string) {
    this._ProductService.deleteProduct(id).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.log(err)
    });
  }

  updateProduct(id: string, data: any) {
    this._ProductService.updateProduct(id, data).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.log(err)
    });
  }

  addToCart(product: any, event: Event) {
    event.preventDefault();

    if (product.stock === 0) {
      alert("Out of stock");
      return;
    }

    const token = localStorage.getItem('Authorization');
    if (!token) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    const cartData = {
      productId: product._id,
      quantity: 1
    };

    this._CartService.postCart(cartData).subscribe({
      next: () => console.log("Added to cart"),
      error: (err) => console.log(err)
    });
  }
}
