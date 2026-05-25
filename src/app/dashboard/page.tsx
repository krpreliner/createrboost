"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, FileText, PenTool, Image as ImageIcon, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

interface DashboardData {
  stats: {
    aiCredits: number;
    totalContent: number;
    scriptsWritten: number;
    thumbnailsCreated: number;
  };
  chartData: {
    name: string;
    generations: number;
  }[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || user?.email?.split('@')[0] || "Creator";

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const res = await fetch("/api/dashboard/overview");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          toast.error(json.error || "Failed to load dashboard data");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { name: 'Remaining AI Credits', value: data.stats.aiCredits, icon: Zap, color: 'text-yellow-400' },
    { name: 'Total Generations', value: data.stats.totalContent, icon: FileText, color: 'text-primary' },
    { name: 'Scripts Written', value: data.stats.scriptsWritten, icon: PenTool, color: 'text-emerald-400' },
    { name: 'Thumbnails Created', value: data.stats.thumbnailsCreated, icon: ImageIcon, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-muted-foreground">Here is your CreatorBoost AI usage overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className={`w-16 h-16 ${stat.color}`} />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground truncate">{stat.name}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl"
        >
          <h2 className="text-lg font-semibold text-white mb-6">AI Generation Activity (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <AreaChart data={data.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(3,0,20,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [value, "Generations"]}
                />
                <Area type="monotone" dataKey="generations" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGenerations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-2xl flex flex-col"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Action Hub</h2>
          <div className="flex-1 space-y-4">
            <Link href="/dashboard/ai-tools/ideas" className="block p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
              <p className="text-sm text-primary font-medium mb-1">💡 Brainstorm Ideas</p>
              <p className="text-xs text-white/80">Use your {data.stats.aiCredits} credits to generate viral content ideas.</p>
            </Link>
            <Link href="/dashboard/ai-tools/scripts" className="block p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
              <p className="text-sm text-blue-400 font-medium mb-1">✍️ Write a Script</p>
              <p className="text-xs text-white/80">Turn your ideas into fully fleshed out YouTube scripts.</p>
            </Link>
            <Link href="/dashboard/ai-tools/thumbnails" className="block p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
              <p className="text-sm text-emerald-400 font-medium mb-1">🖼️ Create a Thumbnail</p>
              <p className="text-xs text-white/80">Generate a high-CTR thumbnail for your latest script.</p>
            </Link>
            <Link href="/dashboard/library" className="block p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
              <p className="text-sm text-amber-400 font-medium mb-1">📚 View Library</p>
              <p className="text-xs text-white/80">Access your {data.stats.totalContent} saved generations.</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

