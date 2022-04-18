const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const publishCtrl = require("./publish_control");

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
const firmwareRoute = require("./routes/firmware_router");

// use routes
app.use("/api/v1", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", carRoute);
app.use("/api/v1", firmwareRoute);

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


// emitted when a client publishes a message packet on the topic
aedes.on("publish", async function (packet, client) {
  if (client) {
    const items = packet.topic.split("/");
    if (items[0] == "car") {
      const carCode = items[1];
      const interface = items[2];

      switch (interface) {
        case "speed":
          publishCtrl.setSpeed(carCode, packet.payload.toString());
          break;
        case "location":
          publishCtrl.setLocation(carCode, packet.payload.toString());
        default:
          break;
      }
    }
  }
});
