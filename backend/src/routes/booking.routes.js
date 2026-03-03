const router = require("express").Router();
const controller = require("../controllers/booking.controller");

router.get("/", controller.getAvailability);
router.post("/", controller.createBooking);
router.patch("/:id/admin", controller.adminAction);
router.patch("/:id/vp", controller.vpAction); 
router.patch("/:id/cancel", controller.cancelBooking);

module.exports = router;