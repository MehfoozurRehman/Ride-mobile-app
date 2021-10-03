const express = require("express");
const mongooose = require("mongoose");
const dotenv = require("dotenv");

//routers
const authRoute = require("./Routes/Auth");
const usersRoute = require("./Routes/Users");

//api config
const app = express();
const port = process.env.PORT || 8800;
dotenv.config();

//middlewares
app.use(express.json());

//db config
mongooose
  .connect(process.env.db_connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connected"))
  .catch((err) => {
    console.log(err);
  });

//api endpoints
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);

//listners
app.listen(port, () => {
  console.log("server running");
});
