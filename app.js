const express = require("express");
const app = express();
const mongoose = require("mongoose");
const indexRouter = require("./routes/index.js");

const { PORT = 3001 } = process.env;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "66f15f8b0cd9ca6ecdd82474",
  };
  next();
});

app.use("/", indexRouter);

// Handle non-existent resources
app.use((req, res, next) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server." });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
