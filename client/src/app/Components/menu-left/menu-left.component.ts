import { Component } from '@angular/core';
import { BaseApiUrl } from 'src/app/general';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent {
  constructor() {
   
  }


  ver: string = JSON.stringify(localStorage.getItem("ver"));
  links = [
    {
      text: "Trang Chủ",
      link: `/${BaseApiUrl.BaoCaos}`,
      icon: "home",
    },
    {
      text: "Đơn Hàng",
      link: `/${BaseApiUrl.DonHangs}`,
      icon: "shopping_basket",
     }
     //,{
    //   text:'Đơn Hàng',
    //   link:`/${BaseApiUrl.listOrders}`,
    //   icon: "shopping_basket",
    // }
    ,{
      text: "Sản Phẩm",
      link:  `/${BaseApiUrl.SanpPhams}`,
      icon: "spa",
    },
    {
      text: "Nhập  - Tồn Kho",
      link:  `/${BaseApiUrl.NhapHangs}`,
      icon: "credit_card",
    },
    {
      text: "Khách Hàng",
      link:  `/${BaseApiUrl.KhachHangs}`,
      icon: "account_box",
    },
    {
      text: "Chi Phí",
      link:  `/${BaseApiUrl.ChiPhis}`,
      icon: "money",
    },
    {
      text: "Công Nợ",
      link:  `/${BaseApiUrl.CongNos}`,
      icon: "monetization_on",
    },
    {
      text: "Cài Dặt",
      link: "/settings",
      icon: "settings",
    },
  ];
}
