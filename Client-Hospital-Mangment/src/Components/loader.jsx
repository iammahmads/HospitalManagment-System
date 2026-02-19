import { Activity } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full h-full min-h-[150px] flex flex-col items-center justify-center gap-3 p-4">
      {/* Spinner Container */}
      <div className="relative flex items-center justify-center">
        
        {/* 1. Background Ring (Subtle Track) */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
        
        {/* 2. Spinning Indicator (Blue Arc) */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        
        {/* 3. Center Icon (Heartbeat) */}
        <div className="absolute flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
      </div>

      {/* Loading Text */}
      <p className="text-sm font-medium text-slate-500 animate-pulse">
        Loading...
      </p>
    </div>
  );
}