const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  // img: {
  //   // We will see how I will implement this...
  // },
  password: {
    type: String,
    required: true,
  },
  accessLevel: {
    type: Number,
    default: 0,
  },
  suspension: {
    isSuspended: {
      type: Boolean,
      default: false,
    },
    expire: Date,
  },
  warnings: [
    {
      warningText: String,
      date: Date,
    },
  ],

  active: {
    type: Boolean, // This will be used to verify if a user has confirmed their account...
    default: false,
  },
  major: {
    type:String,
    required:true,
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
