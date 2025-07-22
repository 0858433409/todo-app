const express = require("express");
const router = express.Router();
const blockController = require("../controllers/blockController");

router.get("/:user_id", blockController.getTaskBlockByWeek);
router.get("/summary/:user_id", blockController.getSummaryByWeek);

module.exports = router;
