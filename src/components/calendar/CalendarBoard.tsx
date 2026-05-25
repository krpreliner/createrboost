"use client";

import { useState, useEffect } from "react";
import { DndContext, useDroppable, DragEndEvent, closestCenter, DragOverlay } from "@dnd-kit/core";
import { ContentCard } from "./ContentCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  day: string;
}

const DAYS = ["Unscheduled", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function DroppableDay({ day, items }: { day: string; items: ContentItem[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: day });

  return (
    <div
      ref={setNodeRef}
      className={`glass-card rounded-2xl flex flex-col h-[500px] overflow-hidden transition-colors ${
        isOver ? "bg-primary/5 border-primary/30" : "bg-black/20"
      }`}
    >
      <div className={`p-4 border-b border-white/5 flex items-center justify-between ${day === "Unscheduled" ? "bg-amber-500/10" : "bg-white/5"}`}>
        <h3 className={`font-semibold ${day === "Unscheduled" ? "text-amber-400" : "text-white"}`}>{day === "Unscheduled" ? "Backlog" : day}</h3>
        <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-muted-foreground">{items.length}</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {items.map((item) => (
          <ContentCard key={item.id} id={item.id} title={item.title} type={item.type} />
        ))}
        {items.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground opacity-50 border-2 border-dashed border-white/5 rounded-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

export function CalendarBoard() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch("/api/dashboard/calendar");
        const json = await res.json();
        if (res.ok) {
          setItems(json.items);
        } else {
          toast.error(json.error || "Failed to load calendar");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const activeItem = items.find(item => item.id === active.id);
      if (!activeItem || activeItem.day === over.id) return;

      const previousDay = activeItem.day;
      const targetDay = over.id as string;

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === active.id ? { ...item, day: targetDay } : item
        )
      );

      try {
        const res = await fetch("/api/dashboard/calendar", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: active.id, day: targetDay }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error);
        }
      } catch (error: any) {
        toast.error("Failed to save schedule change");
        // Revert on failure
        setItems((prev) =>
          prev.map((item) =>
            item.id === active.id ? { ...item, day: previousDay } : item
          )
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const activeItem = items.find(item => item.id === activeId);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 min-w-max">
          {DAYS.map((day) => (
            <div key={day} className="w-72 flex-shrink-0">
              <DroppableDay 
                day={day} 
                items={items.filter((item) => item.day === day)} 
              />
            </div>
          ))}
        </div>
        
        {/* Drag Overlay to keep the card visible while dragging over other elements */}
        <DragOverlay>
          {activeItem ? (
            <ContentCard id={activeItem.id} title={activeItem.title} type={activeItem.type} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
