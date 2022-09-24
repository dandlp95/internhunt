const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true
  },
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
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
