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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
