"use strict";
const winston = require("winston");
const format = winston.format;
require("winston-daily-rotate-file");
const { createLogger } = winston;
class LoggerSystem {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, timestamp, context, requestId, metadata }) => {
        return `[${timestamp}] - ${level}:: ${message}::${context}::${requestId}::${
          metadata ? JSON.stringify(metadata) : ""
        }`;
      }
    );
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "logs/%DATE%-info.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "info",
        }),
        new winston.transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "logs/%DATE%-error.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "error",
        }),
        new winston.transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "logs/%DATE%-warn.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "warn",
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }
    const requestId = req ? req.requestId : "unknown";
    return { context, requestId, metadata };
  }

  log(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = { ...paramsLog, message };
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = { ...paramsLog, message };
    this.logger.error(logObject);
  }
  warn(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = { ...paramsLog, message };
    this.logger.warn(logObject);
  }
}

module.exports = new LoggerSystem();
