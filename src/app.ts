import express, { Request, Response } from "express";
import initDB from "./config/db";


const app = express();
// parser
app.use(express.json());
// app.use(express.urlencoded());

// initializing DB
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System!");
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
