const router = require("express").Router();
const controller = require("../controllers/room.controller");

router.get("/", controller.getRooms);

module.exports = router;