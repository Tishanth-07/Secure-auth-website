"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface PopupMessageProps {
  message: string;
  type: "success" | "error";
  duration?: number;
  onClose?: () => void;
}

export default function PopupMessage({
  message,
  type,
  duration = 5000,
  onClose,
}: PopupMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`
      fixed top-6 right-6 z-50 max-w-sm w-full
      transform transition-all duration-300 ease-out
      ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
    `}
    >
      <div
        className={`
        backdrop-blur-lg rounded-2xl p-4 border shadow-2xl
        ${
          isSuccess
            ? "bg-green-500/20 border-green-500/30"
            : "bg-red-500/20 border-red-500/30"
        }
      `}
      >
        <div className="flex items-start space-x-3">
          <div
            className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isSuccess ? "bg-green-500" : "bg-red-500"}
          `}
          >
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-white" />
            ) : (
              <XCircle className="h-5 w-5 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`
              text-sm font-medium
              ${isSuccess ? "text-green-100" : "text-red-100"}
            `}
            >
              {isSuccess ? "Success!" : "Error!"}
            </p>
            <p
              className={`
              text-sm mt-1
              ${isSuccess ? "text-green-200" : "text-red-200"}
            `}
            >
              {message}
            </p>
          </div>

          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 rounded-full p-1 transition-colors
              ${
                isSuccess
                  ? "text-green-300 hover:text-green-100 hover:bg-green-500/20"
                  : "text-red-300 hover:text-red-100 hover:bg-red-500/20"
              }
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div
          className={`
          mt-3 h-1 rounded-full overflow-hidden
          ${isSuccess ? "bg-green-500/30" : "bg-red-500/30"}
        `}
        >
          <div
            className={`
              h-full rounded-full transition-all ease-linear
              ${isSuccess ? "bg-green-400" : "bg-red-400"}
            `}
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
