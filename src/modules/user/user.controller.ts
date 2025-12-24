import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { userServices } from "./user.service";

// create user
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
    return sendResponse(res, 201, true, "user created successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

// fetch all users
const allUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.allUsers();
    return sendResponse(res, 200, true, "user fetch successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

// update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await userServices.updateUser({
      ...req.body,
      id: Number(userId),
    });
    if (result.rows.length === 0) {
      return sendResponse(res, 404, false, "user not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "update user successfully",
        result.rows[0]
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};
export const userControllers = {
  createUser,
  allUsers,
  updateUser,
};
