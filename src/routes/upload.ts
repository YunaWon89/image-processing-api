import { Router } from "express";
import { upload } from "../config/multer";
import {
  uploadSingle,
  uploadMultiple,
  uploadResponsive,
} from "../controllers/uploadController";

const router = Router();

router.post("/single", upload.single("image"), uploadSingle);

router.post("/multiple", upload.array("images", 10), uploadMultiple);

router.post("/responsive", upload.single("image"), uploadResponsive);

export default router;
