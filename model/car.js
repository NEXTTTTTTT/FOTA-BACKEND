const CarScheme = mongoose.Schema({
  carCode: { type: String, required: true,trim:true },
  password: { type: String, required: true },
  carType: { type: String },
  adminID: { type: String },
  usersIDs: { type: [String] },
  isActive: { type: Boolean, default: false },
  carLocation: {
    type: String,
    required: {
      function() {
        return this.isActive;
      },
    },
  },
  defaultSpeed: { type: Number, default: 120 },
  curentSpeed: {
    type: Number,
    min: [0, `the speed can't be less than zero`],
    default: 0,
  },
  systemVersion: {
    type: String,
    required: true,
    lowercase: true,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  createdBy: {
      type: String,
      default: "Salma",
      validate: {
        validitor: {
          function(params) {
            // todo : check if the params existed in database in employees collection
          },
        },
        message: `not existed in employees`,
      },
    },
  },
);

const Car = mongoose.model("Car", CarScheme);

