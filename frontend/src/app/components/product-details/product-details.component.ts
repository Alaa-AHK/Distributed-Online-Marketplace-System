import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
    product: any;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private _CartService:CartService,
    private router:Router
  ) {}
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
        this.router.navigate(['/cart']); 
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  }


  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getSingleProduct(productId).subscribe({
        next: (res) => {
          this.product = res.product;
        },
        error: (err) => console.log(err)
      });}}

}
