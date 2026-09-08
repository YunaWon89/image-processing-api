import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import uploadRoutes from "./routes/upload";
import processRoutes from "./routes/process";

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/processed", express.static(path.join(process.cwd(), "processed")));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Image Processing API is running",
  });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/process", processRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
