import { Request, Response, NextFunction } from "express";
import { supportedFormats } from "../config/sharp";

export function validateProcessOptions(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { width, height, fit, format, quality, sharpen } = req.body;

  if (width !== undefined) {
    if (
      typeof width !== "number" ||
      !Number.isInteger(width) ||
      width <= 0 ||
      width > 5000
    ) {
      res.status(400).json({
        success: false,
        message: "Width must be an integer between 1 and 5000",
      });
      return;
    }
  }

  if (height !== undefined) {
    if (
      typeof height !== "number" ||
      !Number.isInteger(height) ||
      height <= 0 ||
      height > 5000
    ) {
      res.status(400).json({
        success: false,
        message: "Height must be an integer between 1 and 5000",
      });
      return;
    }
  }

  const allowedFits = ["cover", "contain", "fill", "inside", "outside"];

  if (fit !== undefined && !allowedFits.includes(fit)) {
    res.status(400).json({
      success: false,
      message: "Invalid fit option",
    });
    return;
  }

  if (format !== undefined && !supportedFormats.includes(format)) {
    res.status(400).json({
      success: false,
      message: `Invalid format. Supported formats: ${supportedFormats.join(", ")}`,
    });
    return;
  }

  if (quality !== undefined) {
    if (
      typeof quality !== "number" ||
      !Number.isInteger(quality) ||
      quality < 1 ||
      quality > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Quality must be an integer between 1 and 100",
      });
      return;
    }
  }

  if (sharpen !== undefined && typeof sharpen !== "boolean") {
    res.status(400).json({
      success: false,
      message: "Sharpen must be a boolean",
    });
    return;
  }

  next();
}
