import { pool } from "../../config/db";

// create user
interface IVehicle {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: string;
  availability_status: string;
}
const createVehicle = async (payload: IVehicle) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

// fetch all vehicles
const allVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

// get single vehicle
const singleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

// update vehicle
interface IUVehicle {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: string;
  availability_status: string;
  vehicleId: number;
}
const updateVehicle = async (payload: IUVehicle) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    vehicleId,
  } = payload;
  const result = await pool.query(
    `
  UPDATE vehicles
  SET
    vehicle_name = COALESCE($1, vehicle_name),
    type = COALESCE($2, type),
    registration_number = COALESCE($3, registration_number),
    daily_rent_price = COALESCE($4, daily_rent_price),
    availability_status = COALESCE($5, availability_status)
  WHERE id = $6
  RETURNING *
  `,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId]
  );

  return result;
};

// delete vehicle
const deleteVehicle = async (vehicleId: number) => {
  // Check if vehicle exists
  const vehicle = await pool.query(
    `
    SELECT id
    FROM vehicles
    WHERE id = $1
    `,
    [vehicleId]
  );

  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  // Check for active bookings
  const bookingCheck = await pool.query(
    `
    SELECT id
    FROM bookings
    WHERE vehicle_id = $1
      AND status = 'active'
    `,
    [vehicleId]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  // Delete vehicle
  const result = await pool.query(
    `
    DELETE FROM vehicles
    WHERE id = $1
    RETURNING *
    `,
    [vehicleId]
  );

  return result.rows[0];
};

export const vehicleService = {
  createVehicle,
  allVehicles,
  singleVehicle,
  updateVehicle,
  deleteVehicle,
};
