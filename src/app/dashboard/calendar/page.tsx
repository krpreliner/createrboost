"use client";

import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import { Plus } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full max-w-full overflow-hidden space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Content Calendar</h1>
          <p className="text-muted-foreground">Drag and drop your content to schedule your week.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CalendarBoard />
      </div>
    </div>
  );
}
