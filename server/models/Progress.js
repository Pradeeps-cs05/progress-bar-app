const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  value: Number,
  status: String,
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const progressSchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "IDLE",
  },
  history: [historySchema],
});

module.exports = mongoose.model("Progress", progressSchema);