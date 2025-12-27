import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { authService } from "./auth.service";

// create user
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUser(req.body);
    return sendResponse(res, 201, true, "User registered successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

// signIn user
const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.signinUser(email, password);
    return sendResponse(res, 200, true, "Login successful", result);
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const authControllers = {
  createUser,
  signinUser,
};
