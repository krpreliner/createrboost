"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Bookmark, Trash2, Video, FileText, Hash, Image as ImageIcon, Loader2 } from "lucide-react";

export default function LibraryPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/content?uid=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch library");
        const json = await res.json();
        setItems(json.data || []);
      } catch (error) {
        console.error("Error fetching library:", error);
        toast.error("Failed to load your library. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    
    // Optimistic UI update
    const previousItems = [...items];
    setItems(items.filter(item => item._id !== id));
    toast.success("Item deleted");

    try {
      const res = await fetch("/api/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, uid: user.id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete item from database");
      setItems(previousItems); // revert
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "idea": return <Video className="w-5 h-5 text-blue-400" />;
      case "script": return <FileText className="w-5 h-5 text-purple-400" />;
      case "hook": return <Hash className="w-5 h-5 text-pink-400" />;
      case "thumbnail": return <ImageIcon className="w-5 h-5 text-orange-400" />;
      default: return <Bookmark className="w-5 h-5 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Loading your saved content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Bookmark className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Library</h1>
          <p className="text-muted-foreground mt-1">Access all your saved AI-generated content in one place.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white">Your library is empty</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            You haven't saved any content yet. Head over to the AI Tools to generate and save your best ideas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 rounded-2xl relative group border border-white/5 hover:border-white/20 transition-all flex flex-col"
            >
              <button 
                onClick={() => handleDelete(item._id)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/5 rounded-lg">
                  {getIcon(item.type)}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.type}
                </span>
              </div>

              <div className="flex-1">
                {item.type === "idea" && (
                  <>
                    <h3 className="text-lg font-bold text-white leading-tight mb-2">{item.content.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.content.description}</p>
                    <div className="mt-4 flex items-center justify-between text-xs font-medium">
                      <span className="px-2 py-1 bg-white/5 rounded-md text-gray-300">{item.content.category}</span>
                      <span className="text-green-400">Viral Score: {item.content.estimatedViralScore}</span>
                    </div>
                  </>
                )}
                
                {item.type === "hook" && (
                  <>
                    <p className="text-lg font-semibold text-white mb-3">"{item.content.hookText}"</p>
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Trigger:</span>
                        <span className="text-pink-300">{item.content.psychologyTrigger}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Type:</span>
                        <span className="text-white">{item.content.hookType}</span>
                      </div>
                    </div>
                  </>
                )}

                {item.type === "script" && (
                  <>
                    <h3 className="text-lg font-bold text-white mb-2">Video Script</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.content.scriptText}</p>
                    <div className="text-xs text-purple-300 font-medium">{item.content.estimatedDuration}</div>
                  </>
                )}

                {item.type === "thumbnail" && (
                  <>
                    <div className="text-2xl font-bold text-orange-400 mb-1">{item.content.ctrScore}% CTR</div>
                    <p className="text-sm text-muted-foreground mb-4">Predicted Click-Through Rate</p>
                    <div className="space-y-1">
                      {item.content.betterTitles?.slice(0, 2).map((title: string, i: number) => (
                        <p key={i} className="text-xs text-white bg-white/5 p-2 rounded line-clamp-1">{title}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
