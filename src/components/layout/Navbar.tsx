"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Menu, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-white">CreatorBoost AI</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing</Link>
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-white transition-colors">FAQ</Link>
              
              <div className="flex items-center gap-4">
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : session ? (
                  <Link href="/dashboard" className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-white hover:text-primary transition-colors">
                      Log In
                    </Link>
                    <Link href="/login" className="text-sm font-medium bg-white hover:bg-white/90 text-black px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-white/5"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#features" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-white">Features</Link>
            <Link href="#pricing" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-white">Pricing</Link>
            <Link href="#faq" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-white">FAQ</Link>
            {status === "loading" ? (
               <div className="px-3 py-2"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : session ? (
               <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-primary">Dashboard</Link>
            ) : (
               <>
                 <Link href="/login" className="block px-3 py-2 text-base font-medium text-white">Log In</Link>
                 <Link href="/login" className="block px-3 py-2 text-base font-medium text-primary">Sign Up</Link>
               </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
