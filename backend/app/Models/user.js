const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String,
      minlength: 10,
      maxlength: 10
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "manager", "citizen", "worker"],
      default: "citizen"
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      default: null
    },

    walletBalance: { 
      type: Number, 
      default: 0 
    },
    // Inside userSchema
    skills: { 
      type: [String], 
      default: [],
      enum: ["water", "electricity", "waste", "plumbing", "cleaning","general","other"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
