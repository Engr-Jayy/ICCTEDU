const router = require("express").Router();
const controller = require("../controllers/booking.controller");

router.get("/", controller.getAvailability);
router.post("/", controller.createBooking);
router.patch("/:id/admin", controller.adminAction);

module.exports = router;