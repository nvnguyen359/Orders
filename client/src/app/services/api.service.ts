import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { environment } from "./../environment";
import { Observable, catchError, retry, throwError } from "rxjs";
import { BaseApiUrl } from "../general";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "../Components/dialog-confirm/dialog-confirm.component";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  httpOptions = {
    //
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      responseType: "blob",
    }),
  };
  private handleError(error: HttpErrorResponse) {
    console.log('error',error)
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error("Something bad happened; please try again later.")
    );
  }
  baseServer = "";
  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.baseServer = environment.baseUrl;
  }
  async postPrinters(order:any){
    const pathUrl = `${this.baseServer}/printers`;
    return new Promise((res, rej) => {
      this.http
        .post(pathUrl, order, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          res(e);
        });
    });
  }
  async get(url: string, params?: any, name = "") {
    let pas = "";
    if (params) {
      const entries = Object.entries(params);
      entries.forEach((x: any) => {
        pas += `${x[0]}=${x[1]}&`;
      });
    }

    const pathUrl = `${this.baseServer}/${url}?${pas}`;

    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data: any) => {
          if (Array.isArray(data)) {
            let dt = !BaseApiUrl.Orders ? Array.from(data) : Array.from(data);
            return res(dt);
          } else {
            res(data);
          }
        });
    });
  }
  async getId(url: string, id = "") {
    const pathUrl = `${this.baseServer}/${url}/${id}`;

    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }
  async update(url: string, data: any) {
    const pathUrl = `${this.baseServer}/${url}`;

    return new Promise((res, rej) => {
      this.http
        .put(pathUrl, data, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }

  async create(url: string, data: any) {
    let req = !Array.isArray(data) ? [data] : data;

    req = Array.from(data).map((x: any) => {
      if(!x.id|| x.id=='')
      x["id"] = null;
      return x;
    });
    //console.log("data", data);
    const pathUrl = `${this.baseServer}/${url}`;
    //onsole.log(pathUrl);
    return new Promise((res, rej) => {
      this.http
        .post(pathUrl, data, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          res(e);
        });
    });
  }
  async destroy(url: string, id: any,showDialog=true) {
    const pathUrl = `${this.baseServer}/${url}/${id}`;
    if(showDialog){
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: { header: "Bạn chắc chắn muốn xóa!" },
      });
      return new Promise((res, rej) => {
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result == true) {
            this.http
            .delete(pathUrl, this.httpOptions)
            .pipe(
              retry(3), // retry a failed request up to 3 times
              catchError(this.handleError)
            )
            .subscribe((e) => {
              res(e);
            });
          }
        });
      });
    }else{
      return new Promise((res, rej) => {
        this.http
        .delete(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          res(e);
        });
      });
    }

  
  }
  async bulkDelete(url: string, ids: any) {
    const pathUrl = `${this.baseServer}/${url}?ids=${ids}`;
    console.log(pathUrl);
    return new Promise((res, rej) => {
      this.http.delete(pathUrl, this.httpOptions).subscribe((e) => {
        res(e);
      });
    });
  }

  dowloadfileTemplate() {
    const url = `${this.baseServer}/download`;
    window.location.href = url;
    this.http
      .get(url, { responseType: "blob", reportProgress: true })
      .subscribe((e) => {
        console.log(e);
        // window.location.href = url
      });
  }
}
