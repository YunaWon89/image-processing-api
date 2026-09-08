import { Request, Response, NextFunction } from "express";
import {
  createResponsiveImages,
  createThumbnail,
} from "../services/imageService";

export async function uploadSingle(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadMultiple(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
      return;
    }

    const files = req.files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    }));

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      count: files.length,
      files,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadResponsive(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
      return;
    }

    const responsive = await createResponsiveImages(req.file.filename);

    const thumbnail = await createThumbnail(req.file.filename);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      success: true,
      message: "Responsive images created successfully",
      original: {
        filename: req.file.filename,
        url: `${baseUrl}/uploads/${req.file.filename}`,
      },
      thumbnail: {
        ...thumbnail,
        url: `${baseUrl}/processed/${thumbnail.filename}`,
      },
      responsive: responsive.map((image) => ({
        ...image,
        url: `${baseUrl}/processed/${image.filename}`,
      })),
    });
  } catch (error) {
    next(error);
  }
}
