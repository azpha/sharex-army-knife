import { Router } from "express";
import content from "../controllers/content.js";
import { verifyAuth, verifyUploadToken } from "../utils/auth.js";
import multer from "multer";
import path from "node:path";

console.log(path.join(process.env.DATA_PATH as string, "uploads"));
const router: Router = Router();
const upload = multer({
  dest: path.join(process.env.DATA_PATH as string, "uploads"),
});
router.post(
  "/api/content/upload",
  upload.single("content"),
  verifyUploadToken,
  content.createContent,
);
router.get("/api/content/all", verifyAuth, content.getAllContent);
router.get("/s/:id", content.getScreenshot);
router.get("/t/:id", content.getTextContent);
router.get("/l/:id", content.getLink);
router.get("/f/:id", content.getFile);

export default router;
