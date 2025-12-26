import express from "express";
import auth from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

router.post("/", auth("admin"), vehicleController.createVehicle);

router.get("/", vehicleController.allVehicles);

router.get("/:vehicleId", vehicleController.singleVehicle);


export const vehicleRoutes = router;
