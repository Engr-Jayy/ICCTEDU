const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

const bookingSchema = z.object({
  room: z.string().min(1),
  date: z.string().min(1),
  time_slot: z.string().min(1)
});


// ✅ GET AVAILABILITY (only VP-approved blocks slot)
exports.getAvailability = async (req, res, next) => {
  try {
    const { room, date } = req.query;

    const bookings = await prisma.booking.findMany({
      where: {
        room_name: room,
        date: new Date(date),
        status: "Approved"
      },
      select: { time_slot: true }
    });

    res.json(bookings.map(b => b.time_slot));
  } catch (err) {
    next(err);
  }
};


// ✅ CREATE BOOKING (FIRST STAGE → Pending Admin)
exports.createBooking = async (req, res, next) => {
  try {
    const data = bookingSchema.parse(req.body);

    // 🔒 prevent duplicates across ALL active states
    const exists = await prisma.booking.findFirst({
      where: {
        room_name: data.room,
        date: new Date(data.date),
        time_slot: data.time_slot,
        status: {
          in: ["Pending Admin", "Pending VP", "Approved"]
        }
      }
    });

    if (exists) {
      return res.status(409).json({
        message: "Time slot already taken"
      });
    }

    const booking = await prisma.booking.create({
      data: {
        room_name: data.room,
        date: new Date(data.date),
        time_slot: data.time_slot,
        status: "Pending Admin" // ⭐ VERY IMPORTANT
      }
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};


// ✅ ADMIN ACTION (Admin → VP)
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

// ✅ VP FINAL APPROVAL
exports.vpAction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (action === "approve") {
      const updated = await prisma.booking.update({
        where: { id },
        data: { status: "Approved" }
      });
      return res.json(updated);
    }

    if (action === "reject") {
      const updated = await prisma.booking.update({
        where: { id },
        data: { status: "Rejected by VP" }
      });
      return res.json(updated);
    }

    res.status(400).json({ message: "Invalid action" });

  } catch (err) {
    next(err);
  }
};