const EmployeeScheme = mongoose.Schema({
    employeeName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    profileImage: { type: File },
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
  
  const Employee = mongoose.model("Employee", EmployeeScheme);