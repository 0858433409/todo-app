const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/:user_id", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:user_id", taskController.getTasksByUser);
router.get("/:id", taskController.getTaskById);
router.put("/:id/status", taskController.updateTaskStatus);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
