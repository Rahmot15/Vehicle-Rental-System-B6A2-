import express from "express";
import auth from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

router.post("/", auth("admin"), vehicleController.createVehicle);

router.get("/", vehicleController.allVehicles);

router.get("/:vehicleId", vehicleController.singleVehicle);

router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);

router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);



export const vehicleRoutes = router;
