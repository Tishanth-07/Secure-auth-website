import User from "../models/User.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSessions = 1234; // Replace with real session tracking if available
    const growthRate = "23.5%"; // Replace with real calculation
    const revenue = "$47.2K"; // Replace with real data

    res.json({
      totalUsers,
      activeSessions,
      growthRate,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};
