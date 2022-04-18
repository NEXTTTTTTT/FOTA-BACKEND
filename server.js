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

// // authenticate the connecting client
// aedes.authenticate = (client, username, password, callback) => {
//   password = Buffer.from(password, 'base64').toString();
//   if (username === 'username' && password === 'password') {
//       return callback(null, true);
//   }
//   const error = new Error('Authentication Failed!! Invalid user credentials.');
//   console.log('Error ! Authentication failed.')
//   return callback(error, false)
// }

// // authorizing client to publish on a message topic
// aedes.authorizePublish = (client, packet, callback) => {
//   if (packet.topic === 'home/bedroom/fan') {
//       return callback(null);
//   }
//   console.log('Error ! Unauthorized publish to a topic.')
//   return callback(new Error('You are not authorized to publish on this message topic.'));
// }

// // emitted when a client connects to the broker
// aedes.on('client', function (client) {
//   console.log(`[CLIENT_CONNECTED] Client ${(client ? client.id : client)} connected to broker ${aedes.id}`)
// })

// // emitted when a client disconnects from the broker
// aedes.on('clientDisconnect', function (client) {
//   console.log(`[CLIENT_DISCONNECTED] Client ${(client ? client.id : client)} disconnected from the broker ${aedes.id}`)
// })

// // emitted when a client subscribes to a message topic
// aedes.on('subscribe', function (subscriptions, client) {
//   console.log(`[TOPIC_SUBSCRIBED] Client ${(client ? client.id : client)} subscribed to topics: ${subscriptions.map(s => s.topic).join(',')} on broker ${aedes.id}`)
// })

// // emitted when a client unsubscribes from a message topic
// aedes.on('unsubscribe', function (subscriptions, client) {
//   console.log(`[TOPIC_UNSUBSCRIBED] Client ${(client ? client.id : client)} unsubscribed to topics: ${subscriptions.join(',')} from broker ${aedes.id}`)
// })

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
