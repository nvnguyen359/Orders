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
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed,void", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class OrdersComponent {
  cusomers: any;
  products: any;
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  pageSize = 5;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  columnsToDisplay: string[] = [
    "no",
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
  columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
  expandedElement: any | null;
  constructor(private dialog: MatDialog, private service: ApiService) {}
  async ngOnInit() {
    this.getOrders();
    await this.getCustomers();
  }
  ngAfterViewInit() {
    this.getProduct();
  }
  openDialog(obj: any = null) {
    this.dialog.open(OrderUpsertComponent, {
      data: { customers: this.cusomers, products: this.products, order: obj },
    });
  }
  getOrders(pageIndex = 0, pageSize = 5) {
    console.time("order");
    this.service
      .get(BaseApiUrl.Order, { page: pageIndex, pageSize })
      .then((data: any) => {
        // console.log(data);
        const items = Array.from(data.items)
          .reverse()
          .map((x: any, index: any) => {
            x.no = index + 1 + pageIndex * pageSize;
            return x;
          });

        this.resultsLength = data.count;
        this.dataSource.data = items;

        // this.dataSource.paginator = this.paginator;
        console.timeEnd("order");
      });
  }
  async getCustomers() {
    this.cusomers = (
      (await this.service.get(BaseApiUrl.KhachHangs, {
        columns: "id,name",
      })) as any
    ).items;
  }
  getProduct() {
    this.service
      .get(BaseApiUrl.SanpPhams)
      .then((e: any) => (this.products = e.items));
  }
  public getServerData(event?: PageEvent) {
    this.getOrders(event?.pageIndex, event?.pageSize);
  }
}
