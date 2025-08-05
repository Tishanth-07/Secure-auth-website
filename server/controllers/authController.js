import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import validator from "validator";

// Helper function to generate 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();


// -------------------- REGISTER --------------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character"
      });
    }

    // Check if email already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create verification code
    const verificationCode = generateCode();
    const verificationCodeExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    // Create user but not yet verified
    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpire,
      emailVerified: false
    });

    // Send verification email
    const html = `
      <p>Hi ${name},</p>
      <p>Your verification code is:</p>
      <h2>${verificationCode}</h2>
      <p>This code will expire in 15 minutes.</p>
    `;
    await sendEmail(email, "Email Verification Code", html);

    res.status(201).json({ message: "Verification code sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- VERIFY EMAIL --------------------
export const verifyEmailCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    // Find user by verificationCode
    const user = await User.findOne({ verificationCode: String(code) });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.verificationCodeExpire < Date.now()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;
    await user.save();

    // Auto-login after verification
    generateToken(res, user._id);

    res.json({ message: "Email verified successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// -------------------- LOGIN --------------------
export const login = async (req, res) => {
 try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate token
    generateToken(res, user._id);

  res.json({
    message: "Login successful",
    user: {
      name: user.name,
      email: user.email,
      role: user.role, // <-- This must be included
    },
  });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- LOGOUT --------------------
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// Profile
export const getProfile = (req, res) => {
  res.json({
    user: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};


// Admin Access
export const adminAccess = (req, res) => {
  res.json({ message: "Welcome Admin" });
};

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetCode = generateCode();
    user.resetPasswordCode = resetCode;
    user.resetPasswordCodeExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const html = `
      <p>Hi ${user.name},</p>
      <p>Your password reset code is:</p>
      <h2>${resetCode}</h2>
      <p>This code will expire in 15 minutes.</p>
    `;
    await sendEmail(email, "Password Reset Code", html);

    res.json({ message: "Password reset code sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code)
      return res.status(400).json({ message: "Reset code is required" });

    const user = await User.findOne({ resetPasswordCode: code });

    if (!user || user.resetPasswordCodeExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    res.json({ message: "Reset code verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // get token from URL param
    const { password } = req.body; // new password from body

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Validate password format
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 chars, include 1 capital and 1 number",
      });
    }

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordCode: token,
      resetPasswordCodeExpire: { $gt: Date.now() }, // Not expired
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Check if token expired
    if (user.resetPasswordCodeExpire < Date.now()) {
      return res.status(400).json({ message: "Reset token expired" });
    }

    //  Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Replace old password with new (hashed automatically by pre-save hook)
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpire = undefined;

    await user.save();

    // Generate auth token and send as cookie or JSON response
    generateToken(res, user._id);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- RESEND CODE --------------------
export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (req.query.type === "reset") {
      user.resetPasswordCode = code;
      user.resetPasswordCodeExpire = expireTime;
    } else {
      user.verificationCode = code;
      user.verificationCodeExpire = expireTime;
    }

    await user.save();

    await sendEmail(
      email,
      req.query.type === "reset" ? "Your password reset code" : "Your email verification code",
      `<p>Your code is: <b>${code}</b></p>`
    );

    res.json({ message: "Code resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Google Callback
export const googleCallback = (req, res) => {
  generateToken(res, req.user._id);
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};
