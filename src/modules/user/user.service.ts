import { pool } from "../../config/db";


// fetch all users
const allUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role,created_at FROM users`);
  return result.rows;
};

// update user
interface IUserUpdatePayload {
  id: number;
  name?: string;
  phone?: string;
  role?: "admin" | "customer";
}

interface ILoggedInUser {
  userId: number;
  role: "admin" | "customer";
}

const updateUser = async (
  payload: IUserUpdatePayload,
  loggedInUser: ILoggedInUser
) => {
  const { id, name, phone, role } = payload;

  if (loggedInUser.role === "customer" && loggedInUser.userId !== id) {
    throw new Error("You are not authorized to update this user");
  }

  if (loggedInUser.role === "customer" && role) {
    throw new Error("Customer cannot update role");
  }

  const result = await pool.query(
    `
    UPDATE users
    SET
      name = COALESCE($1, name),
      phone = COALESCE($2, phone),
      role = COALESCE($3, role)
    WHERE id = $4
    RETURNING id, name, email, phone, role
    `,
    [name, phone, role, id]
  );

  return result.rows[0];
};



// delete user
const deleteUser = async (id: number) => {
  // Check if user exists
  const user = await pool.query(
    `SELECT id FROM users WHERE id = $1`,
    [id]
  );

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  // Check for active bookings
  const bookingCheck = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  // Delete user
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userServices = {
  allUsers,
  updateUser,
  deleteUser,
};
