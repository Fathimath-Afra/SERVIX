const { required } = require("joi");
const mongoose = require("mongoose");

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    city:{
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Society", societySchema);
