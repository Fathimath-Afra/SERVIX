const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["water", "electricity", "waste", "plumbing","other"],
      required: true
    },

    images: {
      type: [String],     
      default: []
    },

    location: {
    lat: { type: Number },
    lng: { type: Number }

    },

    status: {
      type: String,
      enum: ["open","assigned", "in-progress", "resolved"],
      default: "open"
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
