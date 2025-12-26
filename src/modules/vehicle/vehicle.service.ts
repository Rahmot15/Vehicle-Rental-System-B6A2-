import { pool } from "../../config/db";

// create user
interface IUser {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: string;
  availability_status: string;
}
const createVehicle = async (payload: IUser) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

export const vehicleService = {
  createVehicle,
};
