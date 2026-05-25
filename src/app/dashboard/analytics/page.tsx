"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Magnet, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { toast } from "sonner";

interface AnalyticsData {
  stats: {
    totalIdeas: number;
    totalHooks: number;
    totalScripts: number;
    totalThumbnails: number;
  };
  timelineData: {
    date: string;
    ideas: number;
    hooks: number;
    scripts: number;
    thumbnails: number;
  }[];
  distributionData: {
    name: string;
    count: number;
    fill: string;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/analytics?days=${days}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          toast.error(json.error || "Failed to load analytics data");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  if (loading && !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { name: 'Total Ideas', value: data?.stats.totalIdeas || 0, icon: Lightbulb, color: 'text-purple-400' },
    { name: 'Total Hooks', value: data?.stats.totalHooks || 0, icon: Magnet, color: 'text-blue-400' },
    { name: 'Total Scripts', value: data?.stats.totalScripts || 0, icon: FileText, color: 'text-emerald-400' },
    { name: 'Total Thumbnails', value: data?.stats.totalThumbnails || 0, icon: ImageIcon, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Deep Analytics</h1>
          <p className="text-muted-foreground">Detailed breakdown of your AI generation history.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className={`w-16 h-16 ${stat.color}`} />
            </div>
            <p className="text-sm font-medium text-muted-foreground relative z-10">{stat.name}</p>
            <div className="flex items-end justify-between mt-2 relative z-10">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Generation Timeline</h2>
          <div className="h-[300px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <AreaChart data={data?.timelineData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0520', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="ideas" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="hooks" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="scripts" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="thumbnails" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Content Distribution</h2>
          <div className="h-[300px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <BarChart data={data?.distributionData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0a0520', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {
                      data?.distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
