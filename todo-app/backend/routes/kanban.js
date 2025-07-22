const express = require("express");
const router = express.Router();
const kanbanController = require("../controllers/kanbanController");

router.get("/:user_id", kanbanController.getKanbanData);

module.exports = router;
