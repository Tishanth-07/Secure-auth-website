"use client";
import React, { useState } from "react";
import api from "../../utils/api";
import PasswordField from "../components/PasswordField";
import InputField from "../components/InputField";
import GoogleButton from "../components/GoogleButton";
import PopupMessage from "../components/PopupMessage";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";

interface LoginResponse {
  user: {
    name: string;
    email: string;
    role: string;
  };
  message: string;
}

export default function LoginPage() {
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const validate = () => {
    let valid = true;
    const newErrors: any = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await api.post<LoginResponse>("/login", { email, password });

      const user = res.data.user; //  Make sure backend returns this

      if (!user) {
        throw new Error("No user returned from login API");
      }

      //  Store user in localStorage immediately
      localStorage.setItem("user", JSON.stringify(user));

      setPopup({ message: "Welcome back! Logging you in...", type: "success" });

      //  Call fetchUser() to sync with AuthContext
      await fetchUser();
      
      //  Redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }, 1500);
    } catch (err: any) {
      setPopup({
        message:
          err.response?.data?.message ||
          "Invalid credentials. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-4 border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">Welcome back</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-purple-200">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
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
            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="h-5 w-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
            />

            <PasswordField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
              disabled={isLoading}
            />

            {/* Links */}
            <div className="flex justify-between text-sm">
              <Link
                href="/forgot-password"
                className="text-purple-300 hover:text-purple-200 transition-colors"
              >
                Forgot password?
              </Link>
              <Link
                href="/register"
                className="text-purple-300 hover:text-purple-200 transition-colors"
              >
                Create account
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-purple-300">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <GoogleButton />
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-purple-200 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-purple-300 text-sm">
            <Lock className="h-4 w-4" />
            <span>Your data is secured with end-to-end encryption</span>
          </div>
        </div>
      </div>

    </div>
  );
}
