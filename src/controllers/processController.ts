import { Request, Response, NextFunction } from "express";
import {
  processImage,
  processImageStream,
  getImageMetadata,
  createThumbnail,
  addWatermark,
} from "../services/imageService";

export async function processImageController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filename = req.params.filename as string;

    const result = await processImage(filename, req.body);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      message: "Image processed successfully",
      image: {
        ...result,
        url: `${baseUrl}/processed/${result.filename}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function convertImageController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filename = req.params.filename as string;

    const result = await processImage(filename, {
      format: req.body.format,
      quality: req.body.quality,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      message: "Image converted successfully",
      image: {
        ...result,
        url: `${baseUrl}/processed/${result.filename}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function metadataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filename = req.params.filename as string;

    const metadata = await getImageMetadata(filename);

    res.status(200).json({
      success: true,
      metadata,
    });
  } catch (error) {
    next(error);
  }
}

export async function thumbnailController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filename = req.params.filename as string;
    const width = req.body.width ?? 300;
    const height = req.body.height ?? 300;

    const result = await createThumbnail(filename, width, height);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      message: "Thumbnail created successfully",
      image: {
        ...result,
        url: `${baseUrl}/processed/${result.filename}`,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function watermarkController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filename = req.params.filename as string;

    const text = req.body.text ?? 'Image Processing API';

    const result = await addWatermark(filename, text);

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.status(200).json({
      success: true,
      message: 'Watermark added successfully',
      image: {
        ...result,
        url: `${baseUrl}/processed/${result.filename}`
      }
    });
  } catch (error) {
    next(error);
  }
}
export async function streamProcessController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filename = req.params.filename as string;
    const width = req.body.width ?? 800;

    const result = await processImageStream(filename, width);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      message: "Image processed with stream successfully",
      image: {
        ...result,
        url: `${baseUrl}/processed/${result.filename}`,
      },
    });
  } catch (error) {
    next(error);
  }
}