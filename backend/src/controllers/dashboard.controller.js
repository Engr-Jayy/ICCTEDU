const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getStats = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { created_at: "desc" }
    });

    // ✅ MUST return array directly
    res.json(bookings);

  } catch (err) {
    next(err);
  }
};