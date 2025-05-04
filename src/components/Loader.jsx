import React from "react";

const Loader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 rounded-full border-8 border-indigo-200 animate-spin"></div>
      <div className="absolute inset-0 rounded-full border-t-8 border-indigo-600 animate-spin"></div>
    </div>
    <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Welcome back!</h2>
    <p className="text-gray-500">Loading your personalized store...</p>
  </div>
);

export default Loader;
