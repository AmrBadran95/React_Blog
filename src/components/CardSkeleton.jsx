import React from "react";

export default function CardSkeleton() {
  return (
    <div className="bg-blue-500 text-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto mb-6 border border-blue-700 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30" />
          <div className="flex flex-col gap-1">
            <div className="w-24 h-3 bg-white/30 rounded" />
            <div className="w-16 h-2 bg-white/20 rounded" />
          </div>
        </div>
        <div className="w-5 h-5 bg-white/30 rounded-full" />
      </div>

      <div className="w-32 h-4 bg-white/30 rounded mb-2" />
      <div className="w-full h-3 bg-white/20 rounded mb-1" />
      <div className="w-full h-3 bg-white/20 rounded mb-3" />

      <div className="w-full h-52 bg-blue-700 rounded-lg mb-3" />

      <div className="flex justify-around border-t border-blue-300 pt-2 text-sm text-white">
        <div className="w-16 h-6 bg-white/30 rounded" />
        <div className="w-20 h-6 bg-white/30 rounded" />
        <div className="w-14 h-6 bg-white/30 rounded" />
      </div>
    </div>
  );
}
