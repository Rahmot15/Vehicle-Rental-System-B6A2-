import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { bookingService } from "./modules/booking/booking.service";


const app = express();
// parser
app.use(express.json());
// app.use(express.urlencoded());

// initializing DB
initDB();

// Set up auto-return for expired bookings (run daily)
setInterval(async () => {
  try {
    await bookingService.autoReturnExpiredBookings();
    console.log("Auto-return process completed");
  } catch (error) {
    console.error("Error in auto-return process:", error);
  }
}, 24 * 60 * 60 * 1000); // Run every 24 hours

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System!");
});

// user CRUD
app.use("/api/v1", userRoutes)

// auth
app.use("/api/v1/auth", authRoutes)

// vehicles
app.use("/api/v1/vehicles", vehicleRoutes)

// booking
app.use("/api/v1/bookings", bookingRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
