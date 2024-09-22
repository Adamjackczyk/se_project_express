const express = require("express");
const app = express();
const mongoose = require("mongoose");
const indexRouter = require("./routes/index.js");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
