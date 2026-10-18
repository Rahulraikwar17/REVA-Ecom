import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "seller"],
  },
  refreshToken: {
    type: String,
  },
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
