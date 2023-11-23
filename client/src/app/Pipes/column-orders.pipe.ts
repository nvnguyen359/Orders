import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "columnOrders",
})
export class ColumnOrdersPipe implements PipeTransform {
  transform(key: any): any {
    //console.log(key)
    const columnsToDisplay = [
      { key: "no", value: "#" },
      { key: "name", value: "Khách Hàng" },
      { key: "status", value: "Trạng Thái" },
      { key: "wage", value: "Tiền Công" },
      { key: "discount", value: "Chiết Khấu" },
      { key: "shippingFee", value: "Phí Vận Chyển" },
      { key: "quantity", value: "SL" },
      { key: "intoMney", value: "Thành Tiền" },
      { key: "pay", value: "Thanh Toán" },
      { key: "createdAt", value: "Ngày" },
    ];
    const name = columnsToDisplay.find((x: any) => x.key == key)?.value;
    return name;
  }
}
