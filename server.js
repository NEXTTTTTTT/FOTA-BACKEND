const express =require('express');
const app = express();

const cors = require('cors');
app.use(cors());

// mongodb connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/fota", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((error) => {
    console.error("error! " + error);
  });

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get("/",function(req,res){
    res.send('Hello from server');
})

// import routers
const carRoute = require('./routes/car_router');
const userRoute = require('./routes/user_router');
const firmwareRoute = require('./routes/firmware_router');
const employeeRoute = require('./routes/employee_router');

// // use routes
// app.use("/api/v1",carRoute);
// app.use("/api/v1",userRoute);
// app.use("/api/v1",employeeRoute);
// app.use("/api/v1",firmwareRoute);

// server listen
app.listen(3000,()=>{
    console.log('server start ....');
})

// broker setup
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const PORT = 1234;

server.listen(PORT, function () {
    console.log(`MQTT Broker running on port: ${PORT}`);
});

server.on('publish',(packet)=>{
     //todo: onPublish()
})
