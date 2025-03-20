"use client";

import { useEffect } from "react";

export default function AppErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h2 className="text-2xl font-semibold text-red-600">
        Oops! Something went wrong.
      </h2>
      <p className="text-gray-500 mt-2">
        An unexpected error occurred. Please try again or contact support if the
        issue persists.
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>
  );
}
