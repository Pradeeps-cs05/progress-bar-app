const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get single task (auto-create if none)
router.get("/", async (req, res) => {
  let task = await Task.findOne();

  if (!task) {
    task = await Task.create({});
  }

  res.json(task);
});

// Update task
router.put("/", async (req, res) => {
  const { value, status } = req.body;

  let task = await Task.findOne();

  if (!task) {
    task = await Task.create({});
  }

  // Save history when completed or cancelled
  if (status === "COMPLETED" || status === "CANCELLED") {
    task.history.push({
      value,
      status,
    });
  }

  task.value = value;
  task.status = status;

  await task.save();

  res.json(task);
});

module.exports = router;