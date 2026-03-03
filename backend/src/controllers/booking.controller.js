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

exports.createBooking = async (req, res, next) => {
  try {
    const data = bookingSchema.parse(req.body);

    const exists = await prisma.booking.findFirst({
      where: {
        room_name: data.room,
        date: new Date(data.date),
        time_slot: data.time_slot,
        status: "booked"
      }
    });

    if (exists) {
      return res.status(409).json({
        message: "Time slot already booked"
      });
    }

    const booking = await prisma.booking.create({
      data: {
        room_name: data.room,
        date: new Date(data.date),
        time_slot: data.time_slot,
        status: "booked"
      }
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};