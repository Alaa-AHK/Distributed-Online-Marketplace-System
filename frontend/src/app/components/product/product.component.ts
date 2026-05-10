import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  showCreateForm = false;
  userRole: string | null = null;
  selectedFile!: File;
  imageBaseUrl = "http://localhost:3000";
  searchKeyword: string = '';

  constructor(
    private _ProductService: ProductService,
    private router: Router,
    private _CartService: CartService
  ) {}

search() {
  const keyword = this.searchKeyword?.trim();

  if (!keyword) {
    this.getProducts();
    return;
  }

  this._ProductService.searchProducts(keyword).subscribe({
    next: (res: any) => {
      this.products = res.products;
    },
    error: (err) => console.log(err)
  });
}

  productCreate = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    brand: new FormControl(null),
    description: new FormControl(null),
    price: new FormControl(null, [Validators.required]),
    quantity: new FormControl(1, [Validators.required]),
    discount: new FormControl(0),
    image: new FormControl(null)
  });

  ngOnInit(): void {
    this.extractUserRole();
    this.getProducts();
  }

  onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

  extractUserRole() {
    const token = localStorage.getItem('Authorization');

    if (!token) return;

    try {
      const pureToken = token.split(' ')[1];
      const decoded: any = JSON.parse(atob(pureToken.split('.')[1]));

      this.userRole = decoded.role;

      console.log("User Role:", this.userRole);
    } catch (e) {
      console.log("Error decoding token", e);
    }
  }

getProducts() {
  this._ProductService.getproducts().subscribe({
    next: (res: any) => {
      console.log("Products API Response:", res);

      if (res?.products && Array.isArray(res.products)) {
        this.products = res.products;
      } else if (Array.isArray(res)) {
        this.products = res;
      } else {
        this.products = [];
      }

      console.log("Mapped products:", this.products);
    },
    error: (err) => {
      console.log("Error loading products:", err);
      this.products = [];
    }
  });
}

sendData() {
  if (this.productCreate.valid) {

    const formData = new FormData();

    formData.append('title', this.productCreate.value.title || '');
    formData.append('brand', this.productCreate.value.brand || '');
    formData.append('description', this.productCreate.value.description || '');
    formData.append('price', String(this.productCreate.value.price));
    formData.append('quantity', String(this.productCreate.value.quantity));
    formData.append('discount', String(this.productCreate.value.discount));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._ProductService.postProduct(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.showCreateForm = false;
        this.getProducts();
      },
      error: (err) => console.log(err)
    });
  }
}

  deleteProduct(id: string) {
    if (!confirm("Are you sure?")) return;

    this._ProductService.deleteProduct(id).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.log(err)
    });
  }

  goToUpdatePage(id: string) {
    this.router.navigate(['/update-product', id]);
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
