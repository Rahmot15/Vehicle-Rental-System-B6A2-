import { pool } from "../../config/db";

interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: any;
}

const createUser = async (payload: IUser) => {
  const { name, email, password, phone, role } = payload;

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, password, phone, role]
  );

  return result.rows[0];
};

const allUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`)
    return result.rows
}

export const userServices = {
  createUser,
  allUsers
};
