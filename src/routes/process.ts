import { Router } from "express";
import { validateProcessOptions } from "../middleware/validation";
import {
  processImageController,
  convertImageController,
  metadataController,
  thumbnailController,
  watermarkController,
  streamProcessController,
} from "../controllers/processController";

const router = Router();

router.post("/:filename", validateProcessOptions, processImageController);
router.post("/:filename/stream", streamProcessController);

router.post(
  "/:filename/convert",
  validateProcessOptions,
  convertImageController,
);

router.get("/:filename/metadata", metadataController);

router.post(
  "/:filename/thumbnail",
  validateProcessOptions,
  thumbnailController,
);
router.post(
  '/:filename/watermark',
  watermarkController
);

export default router;
