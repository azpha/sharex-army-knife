import { Router } from "express";
import { verifyAuth } from "../utils/auth.js";
import auth from "../controllers/auth.js";

const router: Router = Router();
router.post("/register", auth.registerAccount);
router.post("/login", auth.logIntoAccount);
router.patch("/upload-token", verifyAuth, auth.addUploadToken);
router.get("/has-admin", auth.hasAdminRegistered);
router.get("/@me", verifyAuth, auth.getUserAccount);

export default router;
