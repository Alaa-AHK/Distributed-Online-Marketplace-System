import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orders: any[] = []; 

  constructor(private _OrderService: OrderService) {}

  ngOnInit(): void {
    this._OrderService.getUserOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || [];
        console.log('User orders:', this.orders);
      },
      error: (err) => console.error(err)
    });
  }
  deleteItem(Id: string) {
  this._OrderService.deleteOrder(Id).subscribe({
    next: (res) => {
      console.log('Order deleted:', res);

      this._OrderService.getUserOrders().subscribe({
        next: (orders: any[]) => {
          this.orders = orders;   
          console.log('Updated orders:', this.orders);
        },
        error: (err) => console.error(err)
      });
    },
    error: (err) => console.log(err),
    complete: () => console.log('Delete complete')
  });
}

}
