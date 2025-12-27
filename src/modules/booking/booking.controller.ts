import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { bookingService } from "./booking.service";
import { pool } from "../../config/db";

// post booking
interface ILoggedInUser {
  userId?: number;
  email: string;
  role: "admin" | "customer";
  name?: string;
  iat?: number;
  exp?: number;
}

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user as ILoggedInUser;

    // Query the user ID from database using email since token may not contain userId
    let userId: number;
    if (user.userId) {
      userId = user.userId;
    } else {
      const userResult = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [user.email]
      );

      if (userResult.rows.length === 0) {
        return sendResponse(res, 400, false, "User not found");
      }

      userId = userResult.rows[0].id;
    }

    const result = await bookingService.createBooking({
      customerId: userId,
      vehicleId: req.body.vehicleId,
      rentStartDate: req.body.rentStartDate,
      rentEndDate: req.body.rentEndDate,
    });

    return sendResponse(
      res,
      201,
      true,
      "Booking created successfully",
      result
    );
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user as ILoggedInUser;

    // Query the user ID from database using email since token may not contain userId
    let userId: number;
    if (user.userId) {
      userId = user.userId;
    } else {
      const userResult = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [user.email]
      );

      if (userResult.rows.length === 0) {
        return sendResponse(res, 400, false, "User not found");
      }

      userId = userResult.rows[0].id;
    }

    const result = await bookingService.getAllBookings(userId, user.role);

    return sendResponse(
      res,
      200,
      true,
      user.role === 'admin' ? "Bookings retrieved successfully" : "Your bookings retrieved successfully",
      result
    );
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user as ILoggedInUser;
    const { bookingId } = req.params;
    const { status } = req.body;

    // Query the user ID from database using email since token may not contain userId
    let userId: number;
    if (user.userId) {
      userId = user.userId;
    } else {
      const userResult = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [user.email]
      );

      if (userResult.rows.length === 0) {
        return sendResponse(res, 400, false, "User not found");
      }

      userId = userResult.rows[0].id;
    }

    // Validate status based on user role
    if (user.role === 'customer' && status !== 'cancelled') {
      return sendResponse(res, 403, false, "Customers can only cancel bookings");
    }

    if (user.role === 'admin' && status !== 'returned') {
      return sendResponse(res, 403, false, "Admins can only mark bookings as returned");
    }

    const result = await bookingService.updateBooking({
      bookingId: Number(bookingId),
      status,
    }, userId, user.role);

    let message = "Booking updated successfully";
    if (status === "cancelled") {
      message = "Booking cancelled successfully";
    } else if (status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
    }

    return sendResponse(
      res,
      200,
      true,
      message,
      result
    );
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message);
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
