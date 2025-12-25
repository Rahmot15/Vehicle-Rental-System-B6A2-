import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.get("/users", userControllers.allUsers);

router.put("/users/:userId", userControllers.updateUser);

router.delete("/users/:userId", userControllers.deleteUser);

export const userRoutes = router;
