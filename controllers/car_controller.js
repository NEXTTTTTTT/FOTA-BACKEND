exports.getCarsList = async (req, res) => {
  try {
    const result = await Car.find();
    return res.status(200).send(result);
  } catch (error) {
    console.log("error : " + error);
    return res.status(500).send({ error: "failed to list cars" });
  }
};

exports.getCarDetails = async (req, res) => {
  try {
    var id = req.params.id;
    if (!id) {
      return res.status(500).send({ error: "id can't be empty" });
    }
    var result = await Car.find(id);
    return res.status(200).send(result);
  } catch (error) {
    console.log("error : " + error);
    return res.status(500).send({ error: "failed to get car details" });
  }
};

exports.createCar = async (req, res) => {
  try {
    var car = new Car({
      carCode: req.body.carCode,
      password: req.body.password,
      carType: req.body.carType,
      adminID: req.body.adminID,
      usersIDs: req.body.usersIDs,
      isActive: req.body.isActive,
      carLocation: req.body.carLocation,
      defaultSpeed: req.body.defaultSpeed,
      curentSpeed: req.body.curentSpeed,
      systemVersion: req.body.systemVersion,
      createdOn: req.body.createdOn,
      createdBy: req.body.createdBy,
    });
    car.save();
    return res.status(201).send("successfuly car created");
  } catch (error) {
    console.error("error : " + error);
    return res.status(500).send({ error: "failed to save car" });
  }
};

exports.modifyCar = async (req, res) => {
  try {
    var id = req.body.id;
    const query = { _id: id };
    Car.update(query, {
      $set: {
        // todo : set
      },
    });

    return res.status(201).send("successfuly car updated");
  } catch (error) {
    console.error("error : " + error);
    return res.status(500).send({ error: "failed to update the car" });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    var id = req.body.id;
    const query = { _id: id };
    Car.delete(query);
    return res.status(201).send("successfuly car deleted");
  } catch (error) {
    console.error("error : " + error);
    return res.status(500).send({ error: "failed to delete the car" });
  }
};
