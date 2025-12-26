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

// fetch all vehicles
const allVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.allVehicles();
    return sendResponse(res, 200, true, "vehicles fetch successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

// get single vehicle
const singleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.singleVehicle(
      req.params.vehicleId as string
    );

    if (result.rows.length === 0) {
      return sendResponse(res, 404, false, "vehicle not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "vehicles fetch successfully",
        result.rows[0]
      );
    }
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

// Update vehicle
const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const result = await vehicleService.updateVehicle({
      vehicleId: Number(vehicleId),
      vehicle_name: req.body.vehicle_name,
      type: req.body.type,
      daily_rent_price: req.body.daily_rent_price,
      availability_status: req.body.availability_status,
    });

    if (!result) {
      return sendResponse(res, 404, false, "vehicle not found");
    }

    return sendResponse(res, 200, true, "vehicle updated successfully", result.rows[0]);
  } catch (error: any) {
    return sendResponse(res, 403, false, error.message);
  }
};

export const vehicleController = {
  createVehicle,
  allVehicles,
  singleVehicle,
  updateVehicle,
};
