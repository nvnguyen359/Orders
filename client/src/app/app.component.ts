import { Component, Inject } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import "./lib.extensions";
import { NavigationStart, Router, RouterEvent } from "@angular/router";
import { BaseApiUrl, links } from "./general";
import { filter } from "rxjs";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "client";
  showFiller = false;
  pageName?:string = "My App";
  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private router: Router
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        const url = event.url;
        console.log(url);
        this.pageName = links().find((x: any) => x.link == url)?.text;
      }
    });
  }
  ngOnInit(): void {
    this.vi();
    setTimeout(() => {
      if (location.pathname == "/")
        this.router.navigate([`/${BaseApiUrl.BaoCaos}`]);
    }, 500);
  }
  vi() {
    this._locale = "vi";
    this._adapter.setLocale(this._locale);
  }
}
