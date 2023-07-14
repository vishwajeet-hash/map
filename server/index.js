const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express(); //creating express application
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongo db connected!");
  })
  .catch((err) => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8800, () => {
  console.log("backend server is running!");
});
