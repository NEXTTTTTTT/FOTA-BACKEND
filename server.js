const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const publishCtrl = require("./publish_control");

const port = process.env.PORT || 5000;
const brokerPort = process.env.BROKER_PORT;
const brokerHost = process.env.BROKER_HOST;
const brokerUsername = process.env.BROKER_USERNAME;
const brokerPassword = process.env.BROKER_PASSWORD;
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

app.get("/", function (req, res) {
  res.send("HELLO, WE ARE FOTA TEAM!");
});

// import routers
const authRoute = require("./routes/auth_router");
const userRoute = require("./routes/user_router");
const carRoute = require("./routes/car_router");
const firmwareRoute = require("./routes/firmware_router");
const employeeRoute = require("./routes/employee_router");

// use routes
app.use("/api/v1", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", carRoute);
app.use("/api/v1", firmwareRoute);
app.use("/api/v1", employeeRoute);

// server listen
app.listen(port, () => {
  console.log(`server start on port ${port}`);
});

// mqtt client
var mqtt = require("mqtt");

var options = {
  host: brokerHost,
  port: brokerPort,
  protocol: "mqtts",
  username: brokerUsername,
  password: brokerPassword,
};

//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on("connect", function () {
  console.log("Connected to broker");
});

client.on("error", function (error) {
  console.log(error);
});

// subscribe to topic 'car/#'
client.subscribe("car/#");

client.on("message", function (topic, message) {
  //Called each time a message is received
  console.log("Received message:", topic, message.toString());
  if (topic.includes("car/")) {
    const items = topic.split("/");

    const carCode = items[1];
    const interface = items[2];

    switch (interface) {
      case "speed":
        publishCtrl.setSpeed(carCode, message.toString());
        break;
      case "location":
        publishCtrl.setLocation(carCode, message.toString());
      case "active":
        publishCtrl.setActive(carCode,message.toString());
      case "Fuel":
        publishCtrl.setFuel(carCode,message.toString);
      default:
        break;
    }
  }
});

// TODO: publish message 'Hello' to topic 'my/test/topic'
// client.publish('my/test/topic', 'Hello');
