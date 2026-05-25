"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Video, PlayCircle, MessageSquare, GripVertical } from "lucide-react";

interface ContentCardProps {
  id: string;
  title: string;
  type: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case "youtube": return <Video className="w-4 h-4 text-red-500" />;
    case "reels": return <PlayCircle className="w-4 h-4 text-pink-500" />;
    case "tiktok": return <MessageSquare className="w-4 h-4 text-emerald-500" />;
    case "linkedin": return <MessageSquare className="w-4 h-4 text-blue-500" />;
    default: return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
  }
};

export function ContentCard({ id, title, type }: ContentCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { title, type },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card p-3 rounded-lg mb-3 flex items-start gap-2 shadow-sm border border-white/10 relative group ${isDragging ? "cursor-grabbing border-primary" : "cursor-grab"}`}
    >
      <button 
        {...attributes} 
        {...listeners} 
        className="mt-0.5 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          {getIcon(type)}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{type}</span>
        </div>
        <p className="text-sm font-medium text-white truncate">{title}</p>
      </div>
    </div>
  );
}
