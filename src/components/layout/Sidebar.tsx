"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Lightbulb, 
  Settings, 
  LayoutDashboard, 
  Wand2, 
  CalendarDays,
  TrendingUp,
  MessageSquare,
  User,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "AI Tools", href: "/dashboard/ai-tools", icon: Wand2 },
  { name: "Content Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Trend Discovery", href: "/dashboard/trends", icon: TrendingUp },
  { name: "AI Growth Coach", href: "/dashboard/coach", icon: MessageSquare },
  { name: "My Library", href: "/dashboard/library", icon: Bookmark },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || user?.email?.split('@')[0] || "Creator";

  return (
    <div className="hidden lg:flex flex-col w-64 border-r border-white/10 glass bg-background/50 h-screen fixed top-0 left-0">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-white">CreatorBoost</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="flex flex-1 flex-col space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-x-4 p-2 rounded-lg glass-card border border-white/5">
          {user?.image ? (
            <img 
              src={user.image} 
              alt={userName} 
              className="h-9 w-9 rounded-full border border-primary/20 object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <User className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">{userName}</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
