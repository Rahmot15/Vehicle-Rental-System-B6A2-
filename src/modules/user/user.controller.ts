import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
    return sendResponse(res, 201, true, "user created successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

const allUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.allUsers();
    return sendResponse(res, 200, true, "user fetch successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const userControllers = {
  createUser,
  allUsers,
};
