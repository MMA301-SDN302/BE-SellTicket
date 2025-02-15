const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { app } = require("./config/socket.config.js");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const logger = require("./logger");
const locationRoutes = require("./routes/location.router.js"); // Import route location
class App {
  setup = async () => {
    //config cors
    app.use(cors()); //config cors

    //int middlewares
    // app.set("trust proxy", 1)
    app.use(morgan("combined")); //config request return
    app.use(helmet()); //config security request
    app.use(compression()); // data compression
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //init db
    require("./dbs/init.mongodb");

    //Set traceId
    app.use((req, res, next) => {
      const traceId = req.headers["x-trace-id"] || uuidv4();
      if (traceId) {
        req.traceId = traceId;
        req.now = Date.now();
      }
      // ghi log
      // hàm log có 2 tham số
      // tham số 1: message log (ví dụ "Input: ${req.method}") mình sẽ biết đầu vào là loại request gì
      // tham số 2: options là một mảng các giá trị mình muốn log gồm mảng các giá trị mình muốn log
      // [req.path, { requestId: traceId }, data]
      logger.log(`Input: ${req.method}`, [
        req.path,
        { requestId: traceId },
        req.method === "GET" ? req.query : req.body,
      ]);
      next();
    });

    // init routes
    app.use("/v1/api", require("./routes"));

    //handle Error
    app.use((req, res, next) => {
      const error = new Error("Not Found");
      error.status = 404;
      error.error_code = "NOT_FOUND";
      next(error);
    });
  
    // hàm quản lí lỗi
    app.use((error, req, res, next) => {
      const resMessage = `${error.status} - ${Date.now() - req.now}ms - ${
        error.message
      }`;
      const options = [
        req.path,
        { requestId: req.traceId },
        { message: resMessage },
      ];
      const statusCode = error.status || 500;
      if (statusCode === 500) {
        logger.error("error", options);
      } else {
        logger.warn("warn", options);
      }
      if (process.env.NODE_ENV === "pro") {
        return res.status(statusCode).json({
          status: "error",
          code: statusCode,
          error_code: error.error_code,
          message: error.message || "Internal Server Error",
        });
      } else {
        return res.status(statusCode).json({
          status: "error",
          code: statusCode,
          error_code: error.error_code,
          message: error.message,
          stack: error.stack,
        });
      }
    });
  };
}
const appSetup = new App();
appSetup.setup();
module.exports = app;
