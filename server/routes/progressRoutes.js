const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// GET progress
router.get("/", async (req, res) => {
  let progress = await Progress.findOne();

  if (!progress) {
    progress = await Progress.create({});
  }

  res.json(progress);
});

// UPDATE progress
router.put("/", async (req, res) => {
  const { value, status } = req.body;

  let progress = await Progress.findOne();

  if (!progress) {
    progress = await Progress.create({});
  }

  // Save to history if completed or cancelled
  if (status === "COMPLETED" || status === "CANCELLED") {
    progress.history.push({
      value,
      status,
    });
  }

  progress.value = value;
  progress.status = status;

  await progress.save();

  res.json(progress);
});

module.exports = router;