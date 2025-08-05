"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function PasswordField({
  label,
  value,
  onChange,
  error,
  placeholder = "Enter your password",
  disabled = false,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <label className="text-white font-medium block">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
            error ? "border-red-400 focus:ring-red-500" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
        {error && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-200">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
