require("dotenv").config();
const path = require('path');
console.log(process.env.SQLITE_FILENAME) 
const { initTable } = require("./createTable");
const knex = require("knex")({
  client: "sqlite",
  connection: {
    filename: path.join(__dirname,process.env.SQLITE_FILENAME),
  },
  useNullAsDefault: true,
});
class CRUDKNEX {
  constructor(table = null) {
    this.table = table;
  }
  async initTable() {
   return await initTable(knex);
  }
  set setTable(table) {
    this.table = table;
  }
  get getTable() {
    return this.table;
  }
  async create(data) {
    data.createdAt = new Date().addHours(12).toISOString();
    data.updatedAt = new Date().addHours(12).toISOString();
    const result = await knex(this.table).insert([data]);

    return result;
  }
  async update(data) {
    const id = data?.Id;
    data.updatedAt = new Date().addHours(12).toISOString();
    const result = await knex(this.table).where({ id }).update(data);

    return result;
  }
  async upsert(data) {
    return !data.id ? await this.create(data) : await this.update(data);
  }
  async destroy(id) {
    return await knex(this.table).where({ id }).delete();
  }
  async findAll(query = "",limit = 100, offset = 0) {
    const result =
      query == ""
        ? await knex(this.table).select("*").limit(limit).offset(offset)
        : await knex.raw(query);
    console.log("result", result);
    return result;
  }
  async findId(id) {
    return await knex(this.table).where({ id}).first();
  }
  async filterWithObj(obj) {
    return await knex(this.table).where(obj);
  }
  async findOne(obj) {
    return await knex(this.table).where(obj).first();
  }
  async filterQuery(query) {
    const result = await knex.raw(query);
    //console.log(result)
    return result;
  }
}
// (async()=>{
//   let crud = new CRUDKNEX('Đơn Hàng');
//   await crud.getAll()
// })()
module.exports = { CRUDKNEX };
