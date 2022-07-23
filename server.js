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
const notifyRoute = require("./routes/notify_router");

// use routes
app.use("/api/v1", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", carRoute);
app.use("/api/v1", firmwareRoute);
app.use("/api/v1", employeeRoute);
app.use("/api/v1", notifyRoute);

// server listen
app.listen(port, () => {
  console.log(`server start on port ${port}`);
});

// mqtt client
var mqtt = require("mqtt");

//* for secure broker
// var options = {
//   host: brokerHost,
//   port: brokerPort,
//   protocol: "mqtts",
//   username: brokerUsername,
//   password: brokerPassword,
// };

var options = {
  host: 'broker.emqx.io',
  port: 1883,
  protocol: "mqtt",
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

// subscribe to topic 'fota2022/#'
client.subscribe("fota2022/#");

client.on("message", function (topic, message) {
  //Called each time a message is received
  console.log("Received message:", topic, message.toString());

  const topicPath = topic.split("/");
  const source = topicPath[1]; // if you wanna check who sent message
  const carCode = topicPath[2];
  const interface = topicPath[3];

  switch (interface) {
    case "speed":
      publishCtrl.setSpeed(carCode, message.toString(),source);
      break;
    case "gps":
      publishCtrl.setLocation(carCode, message.toString(),source);
      break;
    case "temp":
      publishCtrl.setTemperature(carCode, message.toString(),source);
      break;
    case "motor":
      publishCtrl.setMotor(carCode, message.toString(),source);
      break;
    case "lock":
      publishCtrl.setLock(carCode, message.toString(),source);
      break;
    case "ac":
      publishCtrl.setAC(carCode, message.toString(),source);
      break;
    case "bag":
      publishCtrl.setBag(carCode, message.toString(),source);
      break;

    default:
      break;
  }
});


