const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

const bookingSchema = z.object({
  room: z.string().min(1),
  date: z.string().min(1),
  time_slot: z.string().min(1)
});

exports.getAvailability = async (req, res, next) => {
  try {
    const { room, date } = req.query;

    const bookings = await prisma.booking.findMany({
      where: {
        room_name: room,
        date: new Date(date),
        status: "booked"
      },
      select: { time_slot: true }
    });

    res.json(bookings.map(b => b.time_slot));
  } catch (err) {
    next(err);
  }
};
exports.adminAction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (action === "approve") {
      const updated = await prisma.booking.update({
        where: { id },
        data: { status: "Pending VP" }
      });

      return res.json(updated);
    }

    if (action === "reject") {
      const updated = await prisma.booking.update({
        where: { id },
        data: { status: "Rejected by Admin" }
      });

      return res.json(updated);
    }

    res.status(400).json({ message: "Invalid action" });

  } catch (err) {
    next(err);
  }
};