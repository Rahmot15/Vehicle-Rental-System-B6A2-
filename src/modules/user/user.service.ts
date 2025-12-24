import { pool } from "../../config/db";

interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: any;
}

// create user
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

// fetch all users
const allUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
};

interface IUserUpdate {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}
// update user
const updateUser = async (payload: IUserUpdate) => {
  const { name, email, password, phone, id } = payload;
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, password=$3, phone=$4 WHERE id=$5 RETURNING *`,
    [name, email, password, phone, id]
  );
  return result;
};


export const userServices = {
  createUser,
  allUsers,
  updateUser,
};
