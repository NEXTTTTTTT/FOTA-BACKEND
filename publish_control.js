const Car = require("./model/car");
const User = require("./model/user");
const Notify = require("./model/notify");
const mongoose = require("mongoose");

const FCM = require("fcm-node");

var serverKey = require("./fota-4a39d-firebase-adminsdk-fxeah-c6500c64c9.json"); //put the generated private key path here

var fcm = new FCM(serverKey);

const sendNotification = (token, title, body) => {
  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,
    collapse_key: "green",

    notification: {
      title: title,
      body: body,
    },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

const publishControl = {
  //* Tracking (temp, speed , location)
  setTemperature: async (carCode, temp, source) => {
    try {
      
      await Car.updateOne({ code: carCode }, { temp: temp });
      console.log(`temperatue updated to ${temp}`);
    } catch (error) {
      console.error(error.msg);
    }
  },
  setSpeed: async (carCode, speed, source) => {
    try {
      
      const car = await Car.updateOne(
        { code: carCode },
        { currentSpeed: speed }
      );
      console.log(`speed updated to ${speed}`);

      if (speed > car.defaultSpeed) {
        //* send notify to admin "ahmed driving your car too fast"
        const notify = new Notify({
          action: "speed",
          sender: car.currentUser, // todo
          user: car.admin,
          car: car._id,
        });
        await notify.save();

        const user = await User.findById(car.admin);
        sendNotification(
          user.deviceToken,
          "Over Speed",
          car.brand +
            " " +
            car.code +
            " is on " +
            car.currentSpeed.toString() +
            " KM/H"
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
  setMotor: async (carCode, motor, source) => {
    try {
      
      const car = await Car.updateOne({ code: carCode }, { isMotorOn: motor });
      console.log(`car motor is ${motor}`);
      if (motor == true) {
        //* send notify to admin "ahmed taking your car"
        const notify = new Notify({
          action: "motor",
          sender: mongoose.Schema.Types.ObjectId(source),
          user: car.admin,
          car: car._id,
        });
        await notify.save();
        const user = await User.findById(car.admin);
        sendNotification(
          user.deviceToken,
          "Motor Running",
          car.brand +
            " " +
            car.code +
            " is about to take off by " 
        );
      }
    } catch (error) {
      console.error(error.msg);
    }
  },
  setLock: async (carCode, lock, source) => {
    try {
      
      const car = await Car.updateOne(
        { code: carCode },
        { isDoorLocked: lock }
      );
      console.log(`car lock is ${lock}`);
      if (lock == false) {
        //* send notify to admin "ahmed lock off your car doors"
        const notify = new Notify({
          action: "lock",
          sender: mongoose.Schema.Types.ObjectId(source),
          user: car.admin,
          car: car._id,
        });
        await notify.save();

        const user = await User.findById(car.admin);
        sendNotification(
          user.deviceToken,
          "Lock is broken",
          car.brand +
            " " +
            car.code +
            " doors is open"
        );
      }
    } catch (error) {
      console.error(error.msg);
    }
  },
  setAC: async (carCode, ac, source) => {
    try {
      
      const car = await Car.updateOne({ code: carCode }, { isAcOn: ac });
      console.log(`car ac is ${ac}`);
      
    } catch (error) {
      console.error(error.msg);
    }
  },
  setBag: async (carCode, bag, source) => {
    try {
      
      const car = await Car.updateOne({ code: carCode }, { isBagOn: bag });
      console.log(`car bag is ${bag}`);
      if (bag == true) {
        //* send notify to admin "bag is opened"
        const notify = new Notify({
          action: "bag",
          sender: mongoose.Schema.Types.ObjectId(source),
          user: car.admin,
          car: car._id,
        });
        await notify.save();
        const user = await User.findById(car.admin);
        sendNotification(
          user.deviceToken,
          "Car Bag Opened",
          car.brand +
            " " +
            car.code +
            " bag is open"
        );
      }
    } catch (error) {
      console.error(error.msg);
    }
  },
};

module.exports = publishControl;
