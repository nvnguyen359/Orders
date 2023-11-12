
require("dotenv").config({ path: "../.env" });
require("dotenv").config();
const lib = require("./../shares/lib");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const {uid} = require('uid');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;
class CRUD {
  doc = null;
  constructor(nameSheet) {
    this.nameSheet = nameSheet;
  }

  /**
   * @param {any} nameSheet
   */
  set nameSheetTitle(nameSheet) {
    this.nameSheet = nameSheet;
  }
  get nameSheetTitle() {
    return this.nameSheet;
  }
  async loadInfo() {
    const serviceAccountAuth = new JWT({
      // env var values here are copied from service account credentials generated by google
      // see "Authentication" section in docs for more info
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY.split(String.raw`\n`).join("\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    this.doc = doc;
  }
  async initLoad(nameSheet) {
    if (!nameSheet) nameSheet = this.nameSheet;
    await this.loadInfo();
    return nameSheet;
  }
  async create(values) {
    await this.initLoad();
    const sheet = this.doc.sheetsByTitle[this.nameSheet];
    if (!Array.isArray(values)) {
      values = [values];
    }
    sheet.addRows(values);
  }
  async getAll(limit = null, offset = null) {
    try {
      await this.initLoad(this.nameSheet);
      const sheet = this.doc.sheetsByTitle[this.nameSheet];
      let options = {};
      if (limit) {
        options = { limit, offset };
      }
      const rows = !limit
        ? await sheet.getRows()
        : await sheet.getRows(options); // can pass in { limit, offset };

      return new Promise((res, rej) => {
        let data = [];
        rows.forEach(async (row) => {
          data.push(await this.convertObject(row));
        });
        res(data);
      });
    } catch (error) {
      return error;
    }
  }
  async getDonHangs(){
    this.initLoad('order');
    const donhangs= await await this.getAll();
    this.initLoad('orderDetails');
    const chitiets= await await this.getAll();
    const data = donhangs.map((x)=>{
      x['createdAt']=`${x['createdAt']}`.DateFormatDDMMYYY();
      x['orderDetails']= chitiets.filter(c=>{c['order']==x['Id']; c['createdAt'] =`${c['createdAt']}`.DateFormatDDMMYYY()});
      return x;
    });
    return data;
  }
  async convertObject(row) {
    const _headerValues = row._worksheet._headerValues;
    return new Promise((res, rej) => {
      let result = {};
      Array.from(_headerValues).forEach((x) => {
        result[x] = row.get(x);
      });
      return res(result);
    });
  }
  async getId(id) {
    try {
      await this.initLoad(this.nameSheet);
      const sheet = this.doc.sheetsByTitle[this.nameSheet];
      const rows = Array.from(await sheet.getRows());
      const row = rows.find((x, index) => {
        return rows[index].get("Id") == id;
      });
      return new Promise(async (res, rej) => {
        res({ data: await this.convertObject(row), mes: "success" });
      });
    } catch (error) {
      return { mes: error };
    }
  }
  async post(values) {
    try {
      await this.initLoad(this.nameSheet);
      const sheet = this.doc.sheetsByTitle[this.nameSheet];

      if (!Array.isArray(values)) {
        values = [values];
      }

      const rows = Array.from(await sheet.getRows());
      //const keys = Object.keys(values[0]);
      const count = rows.length;

      const newRows = values.map((x, index) => {
        const id = uid();

        if (x["Id"] == ""|| x['Id']== null ) {
          x["Id"] = id;
        }
        if (x["id"] == "") {
          x["id"] = id;
        }
        return x;
      });
      sheet.addRows(newRows);
      return { data: newRows, mes: "success" };
    } catch (error) {
      return { mes: error };
    }
  }
  async put(value) {
    try {
      let values = Array.isArray(value) ? value : [value];
      await this.initLoad(this.nameSheet);
      const sheet = this.doc.sheetsByTitle[this.nameSheet];
      const array = await sheet.getRows();
      const keys = Object.keys(values[0]);
      const keyId = "Id" || "id";

      return new Promise(async (res, rej) => {
        array.forEach(async (row) => {
          const rowExist = values.find((v, index) => {
            return v[keyId] == row.get(keyId);
          });
          keys.forEach((key) => {
            if (key.includes("createdAt") || key.includes("Thời gian")) {
              // rowExist[key] =  rowExist[key].convertStringVNToDateISO();
            }
          });
          if (rowExist) {
            row.assign(rowExist);
            await row.save();
          }
        });
        res({ data: value, mes: "success" });
      });
    } catch (error) {
      return { mes: error };
    }
  }
  async deleteId(id) {
    await this.initLoad(this.nameSheet);
    const sheet = this.doc.sheetsByTitle[this.nameSheet];
    const rows = Array.from(await sheet.getRows());
    const _headerValues = rows[0]._worksheet._headerValues;
    const row = rows.find((x, index) => {
      return rows[index].get(_headerValues[0]) == id;
    });

    if (row) {
      console.log("Delete ", id);
      row.delete();
      return { mes: "success", data: await this.getAll() };
    } else {
      return { mes: `${id} does not exist` };
    }
  }
  async bulkDelete(ids) {
  //  console.log('bulkDelete ',ids)
    await this.initLoad(this.nameSheet);
    const sheet = this.doc.sheetsByTitle[this.nameSheet];
    const rows = Array.from(await sheet.getRows());
    const _headerValues = rows[0]._worksheet._headerValues;
    let data = [];
    let mess = [];
    for (let i = 0; i < ids.length; i++) {
      const row = rows.find((x, index) => {
        return rows[index].get(_headerValues[0]) == ids[i];
      });
      await lib.delay(50);
      if (row) {
        console.log("bulkDelete ", ids[i]);
        row.delete();
        data.push(ids[i]);
      } else {
        mess.push(`${ids[i]} does not exist`);
      }
    }
    return { data, mess };
  }
  async filters(text) {
    const getAll = await this.getAll();
    const keys = Object.keys(getAll[0]);
    return new Promise((res, rej) => {
      let data = [];
      keys.forEach((key) => {
        const filter = Array.from(getAll).filter((x) =>
          `${x[key]}`
            .xoaDau()
            .toLowerCase()
            .includes(text.xoaDau().toLowerCase())
        );
        if (filter.length > 0) {
          data.push(...filter);
        }
      });
      const map = new Map();
      for (const obj of data) {
        map.set(obj[keys[0]], obj);
      }
      res([...map.values()]);
    });
  }
}

module.exports = { CRUD };