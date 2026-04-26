import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductComponent } from '../product/product.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
