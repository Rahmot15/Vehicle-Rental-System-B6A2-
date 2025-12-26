import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { vehicleService } from "./vehicle.service";

// create user
const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    return sendResponse(res, 201, true, "vehicle created successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const vehicleController = {
  createVehicle,
};
