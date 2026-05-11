import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {

  product: any = {};
  productId!: string;
  imagePreview: string | ArrayBuffer | null = null;
selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.productId =
      this.route.snapshot.paramMap.get('id') || '';

    this.productService
      .getSingleProduct(this.productId)
      .subscribe({

        next: (res: any) => {

          this.product = res.product;

          console.log("Loaded product:", this.product);
        },

        error: (err) => console.log(err)
      });
  }

onFileSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {

    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    // ✅ FIX HERE
    reader.readAsDataURL(this.selectedFile as File);
  }
}

updateProduct() {

  const formData = new FormData();

  formData.append('title', this.product.title || '');
  formData.append('brand', this.product.brand || '');
  formData.append('description', this.product.description || '');
  formData.append('price', this.product.price?.toString() || '0');
  formData.append('quantity', this.product.quantity?.toString() || '0');

  // 📸 FIX IMAGE
  if (this.selectedFile instanceof File) {
    formData.append('image', this.selectedFile);
  }

  console.log("PRODUCT:", this.product);
  console.log("FILE:", this.selectedFile);

  this.productService.updateProduct(
    this.productId,
    formData
  ).subscribe({

    next: (res) => {
      console.log("Updated successfully:", res);
      this.router.navigate(['/product']);
    },

    error: (err) => {
      console.log("UPDATE ERROR:", err);
    }
  });
}
}
