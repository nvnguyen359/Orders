import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderUpsertComponent } from './order-upsert/order-upsert.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  constructor(private dialog: MatDialog) {}
  openDialog() {
    this.dialog.open(OrderUpsertComponent, { data: "ok" });
  }
}
