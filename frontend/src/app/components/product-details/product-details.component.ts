import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private _CartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.getProduct(productId);
    }
  }

  getProduct(id: string) {
  this.productService.getSingleProduct(id).subscribe({
    next: (res) => {
      if (res && res.product) {
        this.product = res.product;
      }
    },
    error: (err) => {
      console.error("Error loading product:", err);
    }
  });
}

  addToCart(product: any, event: Event) {
    event.preventDefault();

    if (!this.product) return;

    if (this.product.stock === 0) {
      alert("Out of stock");
      return;
    }

    const token = localStorage.getItem('Authorization');

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
      next: () => {
        console.log("Added to cart");
        this.router.navigate(['/cart']);
      },
      error: (err) => console.log(err)
    });
  }
}