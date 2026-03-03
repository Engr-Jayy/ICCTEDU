const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getRooms = async (_, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" }
    });
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};