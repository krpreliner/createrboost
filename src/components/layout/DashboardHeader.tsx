"use client";

import { useState } from "react";
import { Bell, Search, Menu, User, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardHeader() {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "Creator";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 glass bg-background/50 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-muted-foreground lg:hidden hover:text-white transition-colors">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground ml-2"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-10 pr-0 text-white placeholder:text-muted-foreground focus:ring-0 sm:text-sm bg-transparent outline-none"
            placeholder="Search AI tools, trends..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-white transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-x-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors group"
            >
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={userName} 
                  className="h-8 w-8 rounded-lg border border-primary/20 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <User className="h-5 w-5" />
                </div>
              )}
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-semibold leading-6 text-white group-hover:text-primary transition-colors" aria-hidden="true">
                  {userName}
                </span>
              </span>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 z-20 mt-2.5 w-48 origin-top-right rounded-2xl bg-[#0a0520] border border-white/10 p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account</p>
                      <p className="text-sm text-white truncate">{session?.user?.email}</p>
                    </div>
                    <button
                      className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </button>
                    <button
                      className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                      onClick={() => {
                        signOut({ callbackUrl: "/login" });
                        setIsProfileOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
