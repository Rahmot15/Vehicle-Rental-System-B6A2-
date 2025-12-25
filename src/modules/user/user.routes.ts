import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/users", auth("admin"), userControllers.allUsers);

router.put("/users/:userId", auth("admin","customer"), userControllers.updateUser);

router.delete("/users/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
