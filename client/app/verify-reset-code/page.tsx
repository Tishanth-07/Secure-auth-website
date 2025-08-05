"use client";
import React, { useState } from "react";
import api from "../../utils/api";
import PopupMessage from "../components/PopupMessage";
import { KeyRound, Shield, ArrowLeft, RefreshCw, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyResetCodePage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setPopup({ message: "Please enter a valid 6-digit code", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/verify-reset-code", { code });
      setPopup({
        message: "Code verified! Redirecting to password reset...",
        type: "success",
      });
      setTimeout(
        () => (window.location.href = `/reset-password/${code}`),
        2000
      );
    } catch (err: any) {
      setPopup({
        message:
          err.response?.data?.message ||
          "Invalid or expired code. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      setPopup({
        message: "No email found. Please restart the reset process.",
        type: "error",
      });
      return;
    }

    setIsResending(true);
    try {
      await api.post("/resend-code?type=reset", { email });
      setPopup({
        message: "Reset code resent to your email!",
        type: "success",
      });
    } catch (err: any) {
      setPopup({
        message: err.response?.data?.message || "Failed to resend code",
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  const formatCode = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digits = value.replace(/\D/g, "").slice(0, 6);
    return digits;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/25 to-rose-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/forgot-password"
          className="inline-flex items-center space-x-2 text-purple-300 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Forgot Password</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verify Reset Code
            </h1>
            <p className="text-purple-200">
              Enter the 6-digit code we sent to your email to proceed with
              password reset
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
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white font-medium block">Reset Code</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(formatCode(e.target.value))}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              <p className="text-purple-300 text-sm text-center">
                Enter the code from your password reset email
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-5 w-5" />
                  <span>Verify Code</span>
                </>
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm mb-3">
              Code expired or didn't receive it?
            </p>
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`}
              />
              <span>{isResending ? "Resending..." : "Resend Code"}</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Security Note</p>
                <p className="text-purple-200 text-sm">
                  Reset codes expire after 15 minutes for your security. If your
                  code has expired, request a new one.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Action */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              Need to use a different email?{" "}
              <Link
                href="/forgot-password"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Start over
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
