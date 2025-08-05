import express from "express";
import passport from "passport";
import generateToken from "../utils/generateToken.js"; // ✅ Import it
import {
  register,
  verifyEmailCode,
  login,
  logout,
  getProfile,
  adminAccess,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  googleCallback,
  resendCode,
} from "../controllers/authController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailCode);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.get("/admin", protect, adminOnly, adminAccess);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-code", resendCode);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false, // ✅ disable session since we're using JWT
  }),
  (req, res) => {
    generateToken(res, req.user._id); // ✅ now works
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);


export default router;
