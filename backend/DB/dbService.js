const config = require("config");

const connectToDb = () => {
  const env = config.get("NODE_ENV");
  console.log("Environment:", env);

  if (env === "development") {
    console.log("Connecting locally...");
    require("./mongoDB/connectLocally");
  }
  if (env === "production") {
    console.log("Connecting to Atlas...");
    require("./mongoDB/connectToAtlas");
  }
};

module.exports = connectToDb;
