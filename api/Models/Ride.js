const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    time: { type: String, required: true },
    createdBy: { type: String, required: true },
    vechical: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", RideSchema);
