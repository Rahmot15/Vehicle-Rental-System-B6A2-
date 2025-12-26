import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";


const app = express();
// parser
app.use(express.json());
// app.use(express.urlencoded());

// initializing DB
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System!");
});

// user CRUD
app.use("/api/v1", userRoutes)

// auth
app.use("/api/v1/auth", authRoutes)

// vehicles
app.use("/api/v1/vehicles", vehicleRoutes)



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
