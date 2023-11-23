const { CRUD } = require("../features/crud");
const { CRUDKNEX } = require("../features/crudKnex");
const lib = require("../shares/lib");
(async () => {
  const crudKnex = new CRUDKNEX();
  let listTable = await crudKnex.initTable();
  //console.log(listTable);
  console.time();
  for (let i = 0; i < listTable.length; i++) {
    const crud = new CRUD();
    crud.nameSheet = listTable[i];
    const array = Array.from(await crud.getAll());
    console.log(listTable[i]);
    for (let j = 0; j < array.length; j++) {
      const x = array[j];
      const knexCrud = new CRUDKNEX(listTable[i]);
      const findId = await knexCrud.findId(x.id);
      if (!findId) {
        await lib.delay(800);
        console.log(await knexCrud.create(x));
      }
    }
  }

  // const arrayImport = Array.from(await crud.getAll());
  // for (let index = 0; index < arrayImport.length; index++) {
  //   const element = arrayImport[index];
  // }
  // console.log(arrayImport.length);
  console.timeEnd();
})();
