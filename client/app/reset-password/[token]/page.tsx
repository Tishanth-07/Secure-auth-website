"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../utils/api";
import PasswordField from "../../components/PasswordField";
import PopupMessage from "../../components/PopupMessage";
import { KeyRound, Shield, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params?.token as string;
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const validatePassword = (pwd: string) => {
    return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(pwd);
  };

  const passwordRequirements = [
    { text: "At least 6 characters", met: password.length >= 6 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One number", met: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setPopup({
        message: "Password must meet all requirements below",
        type: "error",
      });
      return;
    }

    if (password !== confirm) {
      setPopup({ message: "Passwords do not match", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/reset-password/${token}`, { password });
      setPopup({
        message: "Password reset successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setPopup({
        message:
          err.response?.data?.message ||
          "Failed to reset password. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center max-w-md relative z-10">
          <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-purple-200 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            <span>Request New Link</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/25 to-rose-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/login"
          className="inline-flex items-center space-x-2 text-purple-300 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-purple-200">
              Create a new secure password for your account
            </p>
          </div>

          {/* Popup Message */}
          {popup && (
            <PopupMessage
              message={popup.message}
              type={popup.type}
              onClose={() => setPopup(null)}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordField
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              disabled={isLoading}
            />

            {/* Password Requirements */}
            {password && (
              <div className="space-y-2">
                <p className="text-purple-200 text-sm font-medium">
                  Password Requirements:
                </p>
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      req.met ? "text-green-400" : "text-purple-300"
                    }`}
                  >
                    <Check
                      className={`h-3 w-3 ${
                        req.met ? "text-green-400" : "text-gray-400"
                      }`}
                    />
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
            )}

            <PasswordField
              label="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm your new password"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={
                isLoading || !validatePassword(password) || password !== confirm
              }
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-5 w-5" />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Security Tip</p>
                <p className="text-purple-200 text-sm">
                  Choose a strong password that you haven't used elsewhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
