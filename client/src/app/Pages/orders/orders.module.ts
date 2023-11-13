import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OrdersRoutingModule } from "./orders-routing.module";
import { OrdersComponent } from "./orders.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { OrderUpsertComponent } from "./order-upsert/order-upsert.component";
import { MatTabsModule } from "@angular/material/tabs";

@NgModule({
  declarations: [OrdersComponent, OrderUpsertComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersModule {
}
