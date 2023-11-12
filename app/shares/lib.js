const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
Date.prototype.addDays = function (d = 0) {
  this.setTime(this.getTime() + 24 * 60 * 60 * 1000 * d);
  return this;
};
String.prototype.removeAccents = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
String.prototype.xoaDau = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

String.prototype.convertStringVNToDateISO = function () {
  const str = this.split("/").map((x) => parseInt(x));
  let thang = str[1] < 10 ? "0" + str[1] : str[1];
  let ngay = str[0] < 10 ? "0" + str[0] : str[0];
  return str[2] + "-" + thang + "-" + ngay;
};

String.prototype.DateFormatDDMMYYY = function () {
  if (new Date(this.toString()).toString() !== "Invalid Date") {
    var timestamp = new Date(this.toString());
    const day =
      timestamp.getDate() < 10
        ? `0${timestamp.getDate()}`
        : timestamp.getDate();
    const m =
      timestamp.getMonth() + 1 < 10
        ? `0${timestamp.getMonth() + 1}`
        : timestamp.getMonth() + 1;
    return day + "/" + m + "/" + timestamp.getFullYear();
  } else {
    return this.toString();
  }
};
const getPrinters = () => {
  return new Promise((res, rej) => {
    exec("wmic printer list brief", (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        rej(err);
      }
      // list of printers with brief details
      console.log(stdout);
      // the *entire* stdout and stderr (buffered)
      stdout = stdout.split("  ");
      var printers = [];
      j = 0;
      stdout = stdout.filter((item) => item);
      for (i = 0; i < stdout.length; i++) {
        if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
          printers[j] = stdout[i + 1];
          j++;
        }
      }
      // list of only printers name

      console.log(stderr);
      res(printers);
    });
  });
};
function delay(delayInms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
}
function createIdRow(id, nameSheet, startId) {
  if (!startId) startId = createFirstId(nameSheet);
  if (!id) {
    id = "0";
  } else {
    if (typeof id == "number") {
      id = `${startId}${id}`;
    }
  }
  const t = "000000";
  id =
    id == "0"
      ? parseInt(`${id}`.split(startId)[0])
      : parseInt(`${id}`.split(startId)[1]);
  const x = parseInt(id) + 1;
  return `${x}`.length < t.length
    ? `${startId}${t.slice(`${x}`.length)}${x}`
    : `${startId}${x}`;
}
function createFirstId(str) {
  s = "";
  Array.from(str.split(" ")).forEach((x) => {
    s += x[0];
  });
  return s.toUpperCase().removeAccents();
}
function createFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}
function writeFileSync(filePath, data) {
  const arr = filePath.split("/");

  const filename = arr[arr.length - 1];
  const folderName = filePath.replace(filename, "").trim();
  createFolder(folderName);
  try {
    fs.writeFileSync(filePath, data);
    return filePath;
  } catch (error) {
    return error;
  }
}

//moves the $file to $dir2
var moveFile = (file, dir2) => {
  //include the fs, path modules
  var fs = require("fs");
  var path = require("path");

  //gets file name and adds it to dir2
  var f = path.basename(file);
  if (!fs.existsSync(dir2)) {
    fs.mkdirSync(dir2);
  }

  var dest = path.resolve(dir2, f);
  if (fs.existsSync(dest)) {
    return;
  }
  fs.promises.cp(
    file,
    dest,
    {
      recursive: true,
    },
    (err) => {
      if (err) throw err;
      else console.log("Successfully moved");
    }
  );
};

module.exports = {
  getPrinters,
  createIdRow,
  createFolder,
  writeFileSync,
  delay,
  moveFile,
};
