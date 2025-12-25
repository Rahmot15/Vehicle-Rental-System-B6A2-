import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { userServices } from "./user.service";


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
interface ILoggedInUser {
  userId: number;
  role: "admin" | "customer";
  email: string;
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await userServices.updateUser(
      {
        id: Number(userId),
        name: req.body.name,
        phone: req.body.phone,
        role: req.body.role,
      },
      req.user as ILoggedInUser
    );

    if (!result) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(
      res,
      200,
      true,
      "User updated successfully",
      result
    );
  } catch (error: any) {
    return sendResponse(res, 403, false, error.message);
  }
};


// delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const result = await userServices.deleteUser(userId);

    if (result.rowCount === 0) {
      return sendResponse(res, 404, false, "user not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "user delete successfully",
        result.rows
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const userControllers = {
  allUsers,
  updateUser,
  deleteUser,
};
