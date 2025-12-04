const chalk = require("chalk");
const morgan = require("morgan");
const getCurrentDateTimeStr = require("../../utils/dataTimeStr");

const morganLogger = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const logMessage = [
    getCurrentDateTimeStr(),
    tokens.method(req, res),
    tokens.url(req, res),
    status,
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");

  return (status >= 400 ? chalk.redBright : chalk.greenBright)(logMessage);
});

module.exports = morganLogger;
