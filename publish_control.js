const Car = require("./model/car");
const User = require("./model/user");
const Notify = require("./model/notify");
const mongoose = require("mongoose");

const FCM = require("fcm-node");

var serverKey = require("./fcm.json"); //put the generated private key path here

var fcm = new FCM(serverKey);

const getBoolFromString = (stringValue) => {
  switch (stringValue?.toLowerCase()?.trim()) {
    case "true":
    case "yes":
    case "1":
      return true;

    case "false":
    case "no":
    case "0":
    case null:
    case undefined:
      return false;

    default:
      return JSON.parse(stringValue);
  }
};

const sendNotification = (token, title, body) => {
  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,
    
    notification: {
      title: title,
      body: body,
      sound: "default",
      badge: "1",
    },
    data:{
      
    },
    // collapse_key: serverKey,
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};



const publishControl = {
  //* Tracking (temp, speed , location)
  setTemperature: async (carCode, temp, source) => {
    try {
      await Car.updateOne({ code: carCode }, { temp: parseInt(temp) });
      console.log(`temperatue updated to ${temp}`);
    } catch (error) {
      console.error(error.msg);
    }
  },
  setSpeed: async (carCode, speed, source) => {
    try {
      const car = await Car.findOneAndUpdate(
        { code: carCode },
        { currentSpeed: parseInt(speed) }
      ).select("admin _id code carType defaultSpeed lastUser").populate("admin", "deviceToken");
      console.log(`speed updated to ${speed}`);

      if (parseInt(speed) > car.defaultSpeed && car.lastUser != car.admin) {
        console.log(`speed notify`);
        //* send notify to admin "ahmed driving your car too fast"
        const notify = new Notify({
          action: "speed",
          user: car.admin,
          sender:car.lastUser,
          car: car._id,
        });
        await notify.save();

        sendNotification(
          car.admin.deviceToken,
          "Over Speed",
          car.carType + " " + car.code + " is on " + speed + " KM/H"
        );
      }
    } catch (error) {
      console.error(error.msg);
    }
  },

  setLocation: async (carCode, gps, source) => {
    try {
      await Car.updateOne({ code: carCode }, { carLocation: gps });
    } catch (error) {
      console.error(error.msg);
    }
  },

  // controllers
  setMotor: async (carCode, motor, source) => {
    try {
      const car = await Car.findOneAndUpdate(
        { code: carCode },
        { isMotorOn: getBoolFromString(motor) ,lastUser:mongoose.Types.ObjectId(source),}
      )
      .select("admin _id code carType").populate("admin", "deviceToken");
      console.log(car);
      console.log(`car motor is ${motor}`);
      if (getBoolFromString(motor) == true && mongoose.Types.ObjectId(source)!= car.admin) {
        //* send notify to admin "ahmed taking your car"
        const notify = new Notify({
          action: "motor",
          sender: mongoose.Types.ObjectId(source),
          user: car.admin,
          car: car._id,
        });

        await notify.save();
        console.log(car.admin.deviceToken);
        sendNotification(
          car.admin.deviceToken,
          "Motor Running",
          car.carType + "-" + car.code + " is about to take off by "
        );
      }
    } catch (error) {
      console.error(error.msg);
    }
  },
  setLock: async (carCode, lock, source) => {
    try {
      const car = await Car.findOneAndUpdate(
        { code: carCode },
        { isDoorLocked: getBoolFromString(lock),lastUser:mongoose.Types.ObjectId(source), }
      ).select("admin _id code carType").populate("admin", "deviceToken");
      console.log(`car lock is ${lock}`);
      if (getBoolFromString(lock) == false && mongoose.Types.ObjectId(source)!= car.admin) {
        console.log("hey lock"); //todo: test
        //* send notify to admin "ahmed lock off your car doors"
        const notify = new Notify({
          action: "lock",
          sender: mongoose.Types.ObjectId(source),
          user: car.admin,
          car: car._id,
        });
        await notify.save();

        
        sendNotification(
          car.admin.deviceToken,
          "Lock is broken",
          car.carType + "-" + car.code + " lock is open"
        );
      }
    } catch (error) {
      console.error(error.msg);
    }
  },
  setAC: async (carCode, ac, source) => {
    try {
      await Car.updateOne({ code: carCode }, { isAcOn: ac ,lastUser:mongoose.Types.ObjectId(source),});
      console.log(`car ac is ${ac}`);
    } catch (error) {
      console.error(error.msg);
    }
  },
  setBag: async (carCode, bag, source) => {
    try {
      const car = await Car.findOneAndUpdate(
        { code: carCode },
        { isBagOn: getBoolFromString(bag),lastUser:mongoose.Types.ObjectId(source), }
      ).select("admin _id code carType").populate("admin", "deviceToken");
      console.log(`car bag is ${bag}`);
      if (getBoolFromString(bag) == true && mongoose.Types.ObjectId(source)!= car.admin) {
        //* send notify to admin "bag is opened"
        const notify = new Notify({
          action: "bag",
          sender: mongoose.Types.ObjectId(source),
          user: car.admin,
          car: car._id,
        });
        await notify.save();
       
        sendNotification(
          car.admin.deviceToken,
          "Bag Opened",
          car.carType + "-" + car.code + " bag is open"
        );
      }
    } catch (error) {
      console.error(error.msg);
    }
  },
};

module.exports = publishControl;
