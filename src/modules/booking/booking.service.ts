import { pool } from "../../config/db";

interface ICreateBookingPayload {
  customerId: number;
  vehicleId: number;
  rentStartDate: string;
  rentEndDate: string;
}

interface IUpdateBookingPayload {
  bookingId: number;
  status?: 'active' | 'cancelled' | 'returned';
}

const createBooking = async (payload: ICreateBookingPayload) => {
  const { customerId, vehicleId, rentStartDate, rentEndDate } = payload;

  // Validate required fields
  if (!customerId || !vehicleId || !rentStartDate || !rentEndDate) {
    throw new Error("All fields are required: customerId, vehicleId, rentStartDate, rentEndDate");
  }

  // Validate date format
  const startDate = new Date(rentStartDate);
  const endDate = new Date(rentEndDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  // Check if end date is after start date
  if (startDate >= endDate) {
    throw new Error("End date must be after start date");
  }

  // Check if start date is not in the past
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  if (startDate < currentDate) {
    throw new Error("Start date cannot be in the past");
  }

  // 1. Check if customer exists
  const customerResult = await pool.query(
    `SELECT id FROM users WHERE id = $1`,
    [customerId]
  );

  if (customerResult.rows.length === 0) {
    throw new Error("Customer not found");
  }

  // 2. vehicle check
  const vehicleResult = await pool.query(
    `
    SELECT daily_rent_price, availability_status
    FROM vehicles
    WHERE id = $1
    `,
    [vehicleId]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicleResult.rows[0].availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  // 3. Check for conflicting bookings for the same vehicle
  const conflictingBookings = await pool.query(
    `SELECT * FROM bookings
     WHERE vehicle_id = $1
     AND status IN ('active', 'returned')
     AND (
       (rent_start_date <= $2 AND rent_end_date >= $2) OR
       (rent_start_date <= $3 AND rent_end_date >= $3) OR
       (rent_start_date >= $2 AND rent_end_date <= $3)
     )`,
    [vehicleId, rentStartDate, rentEndDate]
  );

  if (conflictingBookings.rows.length > 0) {
    throw new Error("Vehicle is already booked for the selected date range");
  }

  // 4. total price calculate
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    throw new Error("Invalid rent date");
  }

  const totalPrice = Number(vehicleResult.rows[0].daily_rent_price) * days;

  // 5. create booking
  const bookingResult = await pool.query(
    `
    INSERT INTO bookings (
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    )
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
    `,
    [customerId, vehicleId, rentStartDate, rentEndDate, totalPrice]
  );

  // 6. update vehicle status
  await pool.query(
    `
    UPDATE vehicles
    SET availability_status = 'booked'
    WHERE id = $1
    `,
    [vehicleId]
  );

  // 7. Get vehicle details to include in response
  const vehicleDetails = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicleId]
  );

  // Return booking with vehicle details
  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicleDetails.rows[0].vehicle_name,
      daily_rent_price: vehicleDetails.rows[0].daily_rent_price
    }
  };
};

const getAllBookings = async (userId: number, role: string) => {
  let query = `SELECT b.*, v.vehicle_name, v.registration_number, u.name, u.email FROM bookings b
                LEFT JOIN vehicles v ON b.vehicle_id = v.id
                LEFT JOIN users u ON b.customer_id = u.id `;
  const params: any[] = [];

  if (role === 'customer') {
    query += `WHERE b.customer_id = $1`;
    params.push(userId);
  }

  const result = await pool.query(query, params);

  // Format the results based on user role
  return result.rows.map(booking => {
    if (role === 'customer') {
      // For customer, return simplified booking with vehicle details
      return {
        id: booking.id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
          vehicle_name: booking.vehicle_name,
          registration_number: booking.registration_number,
          type: booking.type
        }
      };
    } else {
      // For admin, return full booking with customer and vehicle details
      return {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        customer: {
          name: booking.name,
          email: booking.email
        },
        vehicle: {
          vehicle_name: booking.vehicle_name,
          registration_number: booking.registration_number
        }
      };
    }
  });
};

const updateBooking = async (payload: IUpdateBookingPayload, userId: number, role: string) => {
  const { bookingId, status } = payload;

  // Get the booking to check if it exists and get customer info
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  // Check if customer is trying to cancel before start date
  if (role === 'customer' && status === 'cancelled') {
    const startDate = new Date(booking.rent_start_date);
    const currentDate = new Date();

    if (startDate <= currentDate) {
      throw new Error("Cannot cancel booking after start date");
    }

    // Check if the user is the owner of the booking
    if (booking.customer_id !== userId) {
      throw new Error("Not authorized to cancel this booking");
    }
  }

  // Admin can mark as returned
  if (role === 'admin' && status === 'returned') {
    // Update vehicle status back to available
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  // Update booking status
  const updateResult = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, bookingId]
  );

  // If admin is marking as returned, include vehicle details in response
  if (role === 'admin' && status === 'returned') {
    const vehicleDetails = await pool.query(
      `SELECT availability_status FROM vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      ...updateResult.rows[0],
      vehicle: {
        availability_status: vehicleDetails.rows[0].availability_status
      }
    };
  }

  return updateResult.rows[0];
};

// Function to automatically mark expired bookings as returned
const autoReturnExpiredBookings = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_id FROM bookings
     WHERE status = 'active'
     AND rent_end_date < CURRENT_DATE`
  );

  for (const booking of result.rows) {
    // Update booking status to 'returned'
    await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1`,
      [booking.id]
    );

    // Update vehicle status to 'available'
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  return result.rows;
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
  autoReturnExpiredBookings,
};
