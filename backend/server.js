const express = require("express");
const app = express();
const cors = require("./middlewares/cors");
const { handleError } = require("./utils/errorHandler");
const logger = require("./logger/loggerService");
const connectToDb = require("./DB/dbService");
const config = require("config");
const { generateInitialUsers, generateInitialJobs } = require("./initialData/initialDataService");
const router = require("./router/router");
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads/resumes")));

app.use(cors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(router);


app.use((err, req, res, next) => {
  handleError(res, err.status || 500, err.message);
});

const startServer = async () => {
const PORT = config.get("PORT");
app.listen(PORT, async () => {
  console.log(`/http://localhost:${PORT}`)
   connectToDb();
  await generateInitialUsers();
  await generateInitialJobs();
  });
};

startServer();