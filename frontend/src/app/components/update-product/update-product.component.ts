import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
    product: any = {};
productId!: string;  

constructor(
  private productService: ProductService,
  private route: ActivatedRoute,
  private router: Router
) {}

ngOnInit(): void {
  this.productId = this.route.snapshot.paramMap.get('id') || '';

  this.productService.getSingleProduct(this.productId).subscribe({
    next: (res) => {
      this.product = res; 
    },
    error: (err) => console.log(err)
  });
}

updateProduct() {
  this.productService.updateProduct(this.productId, this.product).subscribe({
    next: (res) => {
      console.log("Updated successfully", res);
      this.router.navigate(['/product']); 
    },
    error: (err) => console.log(err)
  });
}



}
