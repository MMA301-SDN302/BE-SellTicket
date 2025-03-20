"use strict";
const mongoose = require("mongoose");
const env = process.env.NODE_ENV;
let connectString = "";
const {
  db: { host, port, name },
} = require("../config/domain.config");
if (env === "dev") {
  connectString = `mongodb://${host}:${port}/${name}`;
} else {
  connectString = `${process.env.MONGO_URI}`;
}

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    mongoose.set("debug", { shell: true, color: true });
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log(connectString);
        console.log(`Database connected`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
