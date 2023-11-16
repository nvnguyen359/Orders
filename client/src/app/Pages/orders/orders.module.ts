import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OrdersRoutingModule } from "./orders-routing.module";
import { OrdersComponent } from "./orders.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { OrderUpsertComponent } from "./order-upsert/order-upsert.component";
import { MatTabsModule } from "@angular/material/tabs";
import { OrderGridComponent } from "src/app/Components/order-grid/order-grid.component";
import { OrderListViewComponent } from "src/app/Components/order-list-view/order-list-view.component";
import { MatTableModule } from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, SortDirection} from '@angular/material/sort';
@NgModule({
  declarations: [OrdersComponent, OrderUpsertComponent,OrderGridComponent,OrderListViewComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,MatSortModule,MatPaginatorModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersModule {
}
