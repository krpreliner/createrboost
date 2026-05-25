"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, ExternalLink, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</label>
              <input 
                type="text" 
                defaultValue={user?.name || ""} 
                placeholder="Not set"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={user?.email || ""} 
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/50 cursor-not-allowed"
              />
            </div>
          </div>
          <button className="mt-6 px-4 py-2 bg-primary/20 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
            Update Profile
          </button>
        </div>

        {/* Preferences */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" /> Preferences
          </h2>
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive weekly analytics reports and trend alerts.</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Subscription Plan
              </h2>
              <p className="text-sm text-muted-foreground">Current Plan: <span className="text-primary font-bold">Pro (Monthly)</span></p>
            </div>
            <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-white/90 transition-colors flex items-center gap-2">
              Manage Billing <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
          <h2 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-sm text-red-400/60 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
