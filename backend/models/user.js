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
  password: {
    type: String,
    required: true,
  },
  accessLevel: {
    type: Number,
    default: 0,
  },
  verificationCode: {
    type: Number,
    default: null,
    unique: true,
  },
  suspension: {
    isSuspended: {
      type: Boolean,
      default: false,
    },
    expire: {
      type: Date,
      default: null,
    },
  },
  warnings: [
    {
      userViolation: {
        type: {},
      },
      warningText: String,
      issued: Date,
      expiration: Date,
    },
  ],
  active: {
    type: Boolean, // This will be used to verify if a user has confirmed their account...
    default: true, // It is set to true by default just for testing purposes. Once I implement email confirmation, this should be changed to false.
  },
  major: {
    type: Schema.Types.ObjectId,
    ref: "Major",
  },
  profilePicture: {
    type: String,
    default: null,
  },
  accountCreationDate: {
    type: Date,
    default: new Date(),
  },
  gmailLogin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
