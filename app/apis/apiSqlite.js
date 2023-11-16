const { CRUDKNEX } = require("../features/crudKnex");
const lib = require("../shares/lib");
require("colors");
const apisSqlite = async (app) => {

  const array = await getAllTables();
  array.forEach((element) => {
    let crud = new CRUDKNEX(element.trim());
    findAll(element, app, crud);
    findId(element, app, crud);
    findOne(element, app, crud);
    upsert(element, app, crud);
    destroy(element, app, crud);
  });
  getAllOrders(app)
  // let crud = new CRUDKNEX("Đơn Hàng");
  // getAll("donhang", app, crud);
};
const getAllOrders = ( app) => {
  app.get(`/api/orders`, async (req, res, next) => {
    const q = req.query;
    const limit = q.limit | 100;
    const offset = q.offset | 0;
    let crud = new CRUDKNEX("order");
    let listOrders = await crud.findAll(q.query, limit, offset);
   let crudDetails = new CRUDKNEX("orderDetails");
    listOrders  = Array.from(listOrders).map((x)=>{

    })
    res.send(listOrders);
    next();
  });
};
const upsert = (element, app, crud) => {
  app.put(`/api/${element}`, async (req, res, next) => {
    const row = req.body ? req.body : null;
    res.send(await crud.upsert(row));
    next();
  });
};
const findAll = (element, app, crud) => {
  app.get(`/api/${element}`, async (req, res, next) => {
    const q = req.query;
   // console.log(q)
    const limit = parseInt(q.pageSize) ||parseInt(q.limit);
    const offset = parseInt(q.page) || 0;
   // console.log(limit, offset)
    res.send(await crud.findAll( q.query,limit, offset*limit));
    next();
  });
};
const findId = (element, app, crud) => {
  app.get(`/api/${element}/:id`, async (req, res, next) => {
    const id = req.params.id;
    res.send(await crud.findId(id));
    next();
  });
};
const findOne = (element, app, crud) => {
  app.get(`/api/${element}/obj`, async (req, res, next) => {
    const id = req.params.id;
    res.send(await crud.findId(id));
    next();
  });
};
const destroy = (element, app, crud) => {
  app.delete(`/api/${element}/:id`, async (req, res, next) => {
    const id = req.params.id;
    res.send(await crud.destroy(id));
    next();
  });
};
const getAllTables = async () => {
  let crud = new CRUDKNEX();
  const tables = await crud.initTable();
  return tables;
};

module.exports = { apisSqlite,getAllTables };
