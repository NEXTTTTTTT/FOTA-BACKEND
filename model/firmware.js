const FirmwareScheme = mongoose.Schema({
    ChipCode: { type: String, required: true },
    versionName: { type: String, required: true },
    description: { type: String },
    file: { type: File },
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
  
  const Firmaware = mongoose.model("Firmware", FirmwareScheme);