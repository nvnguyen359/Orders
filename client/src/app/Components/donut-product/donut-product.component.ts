import {
  Component,
  Input,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { async } from "@angular/core/testing";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ChartComponent,
} from "ng-apexcharts";
import { delay } from "src/app/general";

import { DataService } from "src/app/services/data.service";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: "app-donut-product",
  templateUrl: "./donut-product.component.html",
  styleUrls: ["./donut-product.component.scss"],
})
export class DonutProductComponent {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: any;
  labels: any[] = [];
  series: any[] = [];
  title: string = "";
  width = 600;
  constructor(private dataService: DataService) {
   
  }
  ngOnInit() {
    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 450,
        type: "donut",
      },
      dataLabels: {
        enabled: true,
      },
      labels: [44, 55, 41, 17, 15],
      fill: {
        type: "gradient",
      },
      legend: {
        formatter: function (val:any, opts:any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      responsive: [
        {
          // breakpoint: 480,
          options: {
            chart: {
              width: this.width,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
    this.dataService.currentMessage.subscribe(async(result: any) => {
      if (result.donut) {
        const array = Array.from(result.donut) as any[];
        if (array.length > 0) {
          this.title = `Sản phẩm bán chạy ` + result.title;
          this.labels = [...new Set(array.map((x: any) => x.name))];
          this.series = [];
          this.labels.forEach((x: any) => {
            const t = array
              .filter((f: any) => f.name == x)
              .map((x: any) => parseInt(x.quantity + ""))
              .reduce((a: number, b: number) => a + b, 0);
            this.series.push(t);
          });
          this.chartOptions.chart.width= this.width;
          this.chartOptions.labels = this.labels;
          this.chartOptions.series = this.series;
          
        }
      }
    });
  }
}
