import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { authService } from "./auth.service";

// create user
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUser(req.body);
    return sendResponse(res, 201, true, "user created successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const authControllers = {
  createUser,
};
