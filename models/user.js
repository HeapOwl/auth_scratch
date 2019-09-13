const localMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(localMongoose);
module.exports = mongoose.model("User", userSchema);
