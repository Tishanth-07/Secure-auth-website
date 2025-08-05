import dotenv from "dotenv";
dotenv.config();

import adminRoutes from "./routes/adminRoutes.js";
(async () => {
  // Now import passport AFTER .env is loaded
  const passport = (await import("./config/passport.js")).default;
  const express = (await import("express")).default;
  const cookieParser = (await import("cookie-parser")).default;
  const cors = (await import("cors")).default;
  const connectDB = (await import("./config/db.js")).default;
  const authRoutes = (await import("./routes/authRoutes.js")).default;

  connectDB();

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

  app.use(passport.initialize());
  app.use("/api", authRoutes);

  app.use("/api/admin", adminRoutes);
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
  });
})();
