const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  city: {
    type: String,
  },
  company: {
    type: Object, // Object with company name, address, website and other opt contact information.
  },
  type: {
    type: String,
    required: true,
  },
  // The user will not add the department manually, the backend will do when they get the majors parameters. It will get the department for a major and add
  departments: [String],
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
//test