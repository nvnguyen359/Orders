import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OrderUpsertComponent } from "./order-upsert/order-upsert.component";
import { ApiService } from "src/app/services/api.service";
import { BaseApiUrl } from "src/app/general";
import { Order } from "src/app/Models/order";
import { HttpClient } from "@angular/common/http";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { async, map, merge, startWith, switchMap } from "rxjs";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent {
  orders: any;
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  pageSize = 5;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  displayedColumns: string[] = [
    "name",
    "status",
    "wage",
    "discount",
    "shippingFee",
    "quantity",
    "intoMney",
    "pay",
    "createdAt",
  ];
  constructor(private dialog: MatDialog, private service: ApiService) {}
  ngOnInit() {
    // this.service.get(BaseApiUrl.ChiTietDonHangs).then((data) => {
    //   let t = data as Order[];
    //   console.log(JSON.stringify(t[0]));
    // });
  }
  ngAfterViewInit() {
    this.getOrders()
  }
  openDialog() {
    this.dialog.open(OrderUpsertComponent, { data: "ok" });
  }
  getOrders(pageIndex = 0, pageSize = 5) {
    this.service.get(BaseApiUrl.Order, { page: pageIndex, pageSize }).then((data:any)=>{
      this.dataSource.data = data.items;
      console.log(data.items)
      this.resultsLength = data.count;
    });
  }
  public getServerData(event?: PageEvent) {
    console.log(event);
    this.getOrders(event?.pageIndex,event?.pageSize)
  }
}