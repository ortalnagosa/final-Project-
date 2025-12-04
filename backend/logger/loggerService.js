const express = require("express");
const app = express();
const morganLogger = require("./loggers/morganLogger");
const config = require("config");

const loggerType = config.get("LOGGER") || "morgan";

if (loggerType === "morgan") {
  app.use(morganLogger);
}

module.exports = app;
