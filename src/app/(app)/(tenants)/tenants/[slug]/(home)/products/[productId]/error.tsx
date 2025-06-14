"use client";

import { TriangleAlert } from "lucide-react";

export default function Errorpage() {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white rounded-lg">
        <TriangleAlert />
        <p className="text-base font-medium">Something went wrong</p>
      </div>
    </div>
  );
}
