const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const userName = config.get("DB_NAME");
const password = config.get("DB_PASSWORD");

mongoose
  .connect(
    `mongodb+srv://${userName}:${password}@hackeru-cluster.mcp4ruy.mongodb.net/`
  )
  .then(() => console.log(chalk.magentaBright("Connect To Atlas MongoDB!")))
  .catch((error) => {
    console.log(chalk.redBright(error));
  });
