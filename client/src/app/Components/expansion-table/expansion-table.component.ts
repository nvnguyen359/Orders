import { CommonModule, NgFor, NgIf, formatNumber } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { ColumnOrdersPipe } from "src/app/Pipes/column-orders.pipe";
import { FormatValuePipe } from "src/app/Pipes/format-value.pipe";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { InforCustomerInOrderComponent } from "../infor-customer-in-order/infor-customer-in-order.component";
import { StatusComponent } from "../status/status.component";
import { BaseApiUrl, Status } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { SelectionModel } from "@angular/cdk/collections";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-expansion-table",
  standalone: true,
  // declarations:[FormatValuePipe,ColumnOrdersPipe],
  templateUrl: "./expansion-table.component.html",
  styleUrls: ["./expansion-table.component.scss"],
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    AutocompleteComponent,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatRippleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    MatAutocompleteModule,
    StatusComponent,
    InforCustomerInOrderComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ExpansionTableComponent {
  @Input() options: any = {
    url: "",
    displayedColumns: [],
    pageSize: 10,
  };
  @Output() eventDelete = new EventEmitter();
  @Output() eventUpsert = new EventEmitter();
  displayedColumns: string[] = [
    "no",
    "name",
    "importPrice",
    "price",
    "unit",
    "createdAt",
  ];
  selection = new SelectionModel<any>(true, []);
  array: any;
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  pageSize = this.options.pageSize;
  pageEvent?: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  disabled = "disabled";
  constructor(
    private service: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private router: Router
  ) {}
  ngOnInit() {
    if (this.options.displayedColumns) {
      this.displayedColumns = this.options.displayedColumns;
    }
    this.getData();
    this.dataService.currentMessage.subscribe((result: any) => {
      if (result.status == Status.Refesh) {
        this.getData();
      }
    });
  }
  ngAfterViewInit() {}
  getData() {
    this.selection.clear();
    const pageIndex = this.pageEvent?.pageIndex || 0;
    const pageSize = this.pageEvent?.pageSize || this.pageSize;
    if (!this.options.url) {
      this.options.url = this.router.url.replace("/", "").trim();
    }
    this.service
      .get(this.options.url, { page: pageIndex, pageSize })
      .then((data: any) => {
        const items = Array.from(data.items).map((x: any, index: any) => {
          x.no = index + 1 + pageIndex * pageSize;
          return x;
        });
        this.resultsLength = data.count;
        this.dataSource.data = items;
        this.changeDetectorRefs.detectChanges();
      });
  }
  getServerData(event: PageEvent) {
    this.pageEvent = event;
    this.getData();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    this.disabled = this.selection.selected.length > 0 ? "submit" : "disabled";
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }
  async onbulkDelete() {
    if (this.selection.selected.length < 1) return;
    const ids = (this.selection.selected as any[]).map((x: any) => x.id);
    const result = await this.service.bulkDelete(this.options.url, ids);
    if (result) {
      this.getData();
    }
  }
  onUpdates() {
    if (this.selection.selected.length < 1) return;
    const value = this.selection.selected.map((x: any) => {
      delete x.no;
      return x;
    });
    this.eventUpsert.emit(value);
  }
  onCreate() {}
  //******************************************** */
  columnOrders(key: any) {
    const columnsToDisplay = [
      { key: "no", value: "#" },
      { key: "name", value: "Tên" },
      { key: "status", value: "Trạng Thái" },
      { key: "wage", value: "Tiền Công" },
      { key: "discount", value: "Chiết Khấu" },
      { key: "shippingFee", value: "Phí Vận Chyển" },
      { key: "quantity", value: "SL" },
      { key: "intoMney", value: "Thành Tiền" },
      { key: "pay", value: "Thanh Toán" },
      { key: "createdAt", value: "Ngày" },
      { key: "price", value: "Gía Bán" },
      { key: "importPrice", value: "Gía Nhập" },
      { key: "unit", value: "Đơn Vị" },
      { key: "no", value: "#" },
      { key: "address", value: "Địa Chỉ" },
      { key: "phone", value: "Phone" },
      { key: "email", value: "Email" },
    ];
    const name = columnsToDisplay.find((x: any) => x.key == key)?.value;
    return name;
  }
  formatValue(value: any) {
    if (value == undefined) return value;
    if (this.isNumeric(value)) {
      return parseInt(value).toLocaleString("vi");
    } else {
      if (new Date(value).toString() != "Invalid Date") {
        return new Date(value).toLocaleDateString("vi");
      } else {
        return value;
      }
    }
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
  isValidDate(d: any) {
    return d instanceof Date;
  }
  textAligh(value: any) {
    const t = this.isNumeric(value) ? "text-right" : "text-left";
    return t;
  }
  thTextAligh(value: any) {
    return `${value}`.includes("price") || `${value}`.includes("Price")
      ? "text-right"
      : "text-left";
  }
}
