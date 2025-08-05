"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Activity,
  TrendingUp,
} from "lucide-react";

interface StatsResponse {
  totalUsers: number;
  activeSessions: number;
  growthRate: string;
  revenue: string;
}

export default function AdminPage() {
  const { user, fetchUser } = useAuth();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user info on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch admin stats from backend
  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminStats();
    }
  }, [user]);

  const loadAdminStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get<StatsResponse>("/admin/stats");
      setStats(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoadingStats(false);
    }
  };

  // Show loading if user info not ready
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading user...</p>
        </div>
      </div>
    );
  }

  // Restrict access if not admin
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center max-w-md">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-red-200">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-purple-200">Welcome back, {user.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loadingStats ? (
          <p className="text-white">Loading stats...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers.toString()}
              change="+12%"
            />
            <StatCard
              icon={Activity}
              label="Active Sessions"
              value={stats.activeSessions.toString()}
              change="+8%"
            />
            <StatCard
              icon={TrendingUp}
              label="Growth Rate"
              value={stats.growthRate}
              change="+2.1%"
            />
            <StatCard
              icon={BarChart3}
              label="Revenue"
              value={stats.revenue}
              change="+15%"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-green-400 text-sm font-medium">{change}</span>
      </div>
      <h3 className="text-white text-2xl font-bold">{value}</h3>
      <p className="text-purple-200 text-sm">{label}</p>
    </div>
  );
}
