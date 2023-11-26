import { NgFor, NgIf } from "@angular/common";
import {
  Component,
  Inject,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { Fields } from "src/app/Models/field";
import { Status, delay, links } from "src/app/general";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
@Component({
  selector: "app-dynamic-upsert",
  templateUrl: "./dynamic-upsert.component.html",
  styleUrls: ["./dynamic-upsert.component.scss"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgFor,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    MatDatepickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class DynamicUpsertComponent {
  form: any;
  removeAts: any[] = [];
  infor = "Thêm Khách Hàng Mới";
  fieldsShow: any;
  fieldsHidden: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private service: ApiService,
    private dialogRef: MatDialogRef<DynamicUpsertComponent>,
    private dataService: DataService
  ) {}
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    let formArray = this.fb.array([]) as FormArray;
    let array: any = [];
    //console.log(this.data.fields)
    this.fieldsShow = (this.data.fields as Fields[]).filter(
      (x: Fields) => x.type != "hidden"
    );
    this.fieldsHidden = (this.data.fields as Fields[]).filter(
      (x: Fields) => x.type == "hidden"
    );
    console.log("re", this.data.value);
    if (Array.from(this.data.value).length > 0) {
      array = Array.isArray(this.data.value)
        ? Array.from(this.data.value)
        : [this.data.value];
      this.infor = `Cập Nhật ${
        links().find((x: any) => x.link.includes(this.router.url))?.text
      }`;
      for (let index = 0; index < array.length; index++) {
        const customer = array[index];
        formArray.push(this.fb.group(customer));
      }
      this.form = this.fb.group({
        formArray: formArray,
      });
    } else {
      this.infor = `Thêm Mới ${
        links().find((x: any) => x.link.includes(this.router.url))?.text
      }`;
      this.form = this.fb.group({
        formArray: formArray,
        createdAt: [new Date(), Validators.required],
      });
      this.onAdd();
      this.onAdd();
      this.onAdd();
    }
  }
  onAdd() {
    const arr = this.form.controls["formArray"] as FormArray;
    let obj = this.data.obj;
    console.log(obj)
    arr.push(this.fb.group(obj));
  }
  async onSubmit() {
    console.log(this.form.value.createdAt);
    const array = this.form.value?.formArray.map((x: any) => {
      x.updatedAt = new Date();
      x.createdAt = new Date(this.form.value.createdAt);
      return x;
    }) as any[];
    const arrUpdate = array.filter((x: any) => x.id != "" || x.id != null);
    const arrCreate = array.filter((x: any) => x.id == "" || x.id == null);
    const url = this.router.url.replace("/", "").trim();
    console.log("arrUpdate", arrUpdate, arrUpdate.length);
    if (arrUpdate.length > 0) {
      for (let index = 0; index < arrUpdate.length; index++) {
        const element = arrUpdate[index];
        const result = await this.service.update(url, element);
        //console.log(result);
        await delay(200);
      }
    }
    if (arrCreate.length > 0) {
      console.log("create");
      await this.service.create(url, arrCreate);
    }
    this.dialogRef.close(true);
    this.dataService.sendMessage({ status: Status.Refesh });
  }
  onDelete(index: any) {
    const ctrl = this.form.controls["formArray"];
    const value = ctrl.value;
    const removeItem = ctrl.value.at(index);
    if (removeItem["id"] != "") this.removeAts.push(removeItem);
    ctrl.setValue(
      value
        .slice(0, index)
        .concat(value.slice(index + 1))
        .concat(value[index])
    );
    ctrl.removeAt(value.length - 1);
    //console.log(this.removeAts)
    return;
  }
  trackByFn(index: any) {
    return index;
  }
}
