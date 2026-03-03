const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getStats = async (_, res, next) => {
  try {
    const totalBookings = await prisma.booking.count({
      where: { status: "booked" }
    });

    const totalRooms = await prisma.room.count();

    res.json({
      totalBookings,
      totalRooms
    });
  } catch (err) {
    next(err);
  }
};