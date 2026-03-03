const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getStats = async (_, res, next) => {
  try {
const bookings = await prisma.booking.findMany({
  orderBy: { created_at: "desc" }
});

    res.json({
      bookings
    });
  } catch (err) {
    next(err);
  }
};