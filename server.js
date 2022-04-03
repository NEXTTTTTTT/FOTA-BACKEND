const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 5000;
const brokerPort = process.env.BROKER_PORT;
const URL = process.env.MONGO_URI;

const app = express();
app.use(express.json()); // for body parsing..
app.use(cors());
app.use(cookieparser());

// mongodb connection
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connected .."))
  .catch((error) => {
    console.error("error! " + error);
  });

// socket io
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.send("Hello from server");
});

// import routers
const authRoute = require("./routes/auth_router");
const userRoute = require("./routes/user_router");
const carRoute = require("./routes/car_router");

// use routes
app.use("/api/v1", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", carRoute);

// server listen
app.listen(port, () => {
  console.log(`server start on port ${port}`);
});

// broker setup
const aedes = require("aedes")();
const broker = require("net").createServer(aedes.handle);

broker.listen(brokerPort, function () {
  console.log(`MQTT Broker running on port: ${brokerPort}`);
});

broker.on("publish", (packet) => {
  // TODO: on publish , we should update database depends on different topics
});
