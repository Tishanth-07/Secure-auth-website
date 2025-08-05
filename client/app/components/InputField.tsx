"use client";
import React from "react";
import { AlertCircle } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function InputField({
  label,
  error,
  icon,
  className,
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-white font-medium block">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full ${
            icon ? "pl-12" : "pl-4"
          } pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
            error ? "border-red-400 focus:ring-red-500" : ""
          } ${className}`}
        />
        {error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
