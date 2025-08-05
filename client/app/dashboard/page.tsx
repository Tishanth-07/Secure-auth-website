"use client";
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  ExternalLink,
  LogOut,
  Crown,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, fetchUser, logout, isAdmin } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 mb-6 border border-white/20">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-white font-medium">
              Welcome to your dashboard
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Hello,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user.name}
            </span>
          </h1>
          <p className="text-blue-200 text-lg">
            Manage your account and explore your options
          </p>
        </div>

        {/* Main Dashboard Content */}
        <div className="max-w-4xl mx-auto">
          {/* User Info Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                {user.role === "admin" && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-blue-200 text-sm">Days Active</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-blue-200 text-sm">Logins This Week</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-blue-200 text-sm">Profile Complete</div>
              </div>
            </div>

            {/* Admin Panel Link */}
            {user.role === "admin" && (
              <div className="mb-6">
                <Link href="/admin">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Crown className="h-6 w-6 text-white" />
                        <div>
                          <h3 className="text-white font-bold">Admin Panel</h3>
                          <p className="text-yellow-100 text-sm">
                            Manage users and system settings
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                Edit Profile
              </button>
              <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                Account Settings
              </button>
              <button
                onClick={logout}
                className="flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 hover:text-red-200 font-medium py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Security</h3>
              <p className="text-blue-200 text-sm mb-4">
                Manage your account security settings and two-factor
                authentication.
              </p>
              <button className="text-green-400 hover:text-green-300 font-medium transition-colors">
                Configure →
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Preferences</h3>
              <p className="text-blue-200 text-sm mb-4">
                Customize your experience with themes, notifications, and more.
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Personalize →
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
