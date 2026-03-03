const router = require("express").Router();
const controller = require("../controllers/dashboard.controller");

router.get("/stats", controller.getStats);

module.exports = router;