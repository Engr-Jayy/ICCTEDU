require("dotenv").config();
const express = require("express");
const cors = require("cors");

const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "API running" });
});

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});