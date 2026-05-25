'use client';

import { Dumbbell, CreditCard, Calendar, Activity, Clock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data.user);
          setMembershipData(data.membership);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-white flex items-center justify-center font-bold uppercase tracking-widest">Loading Your Profile...</div>;
  }

  // Calculate days remaining if membership exists
  let daysRemaining = 0;
  if (membershipData && membershipData.endDate) {
    const end = new Date(membershipData.endDate).getTime();
    const now = new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Header */}
      <div className="bg-surface border-b border-white/5 py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden">
              <span className="text-2xl font-black text-primary">{userData?.name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{userData?.name || 'Member'}</h1>
              <p className="text-gray-400">ID: {userData?._id?.substring(userData._id.length - 8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 font-bold text-sm uppercase">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Membership Status Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 border-primary/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h2 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Current Plan</h2>
                  <h3 className="text-3xl font-black text-white uppercase">{membershipData?.planName || 'No Active Plan'}</h3>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                  userData?.membershipStatus === 'active' ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 
                  'bg-red-500/20 text-red-500 border border-red-500/50'
                }`}>
                  {userData?.membershipStatus || 'Inactive'}
                </span>
              </div>

              {membershipData ? (
                <div className="flex items-center gap-8 relative z-10">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Days Remaining</p>
                    <p className="text-4xl font-black text-primary">{daysRemaining}</p>
                  </div>
                  <div className="h-12 w-px bg-white/10"></div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Expires On</p>
                    <p className="text-xl font-bold text-white">{new Date(membershipData.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 relative z-10">
                  <Link href="/#pricing" className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors hover:bg-red-600">
                    Browse Plans
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Upcoming Classes/Sessions */}
            <div className="glass-card p-8 border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Upcoming Sessions</h3>
                <button className="text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">Book New</button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-4 rounded-xl bg-surface border border-white/5 hover:border-primary/50 transition-colors">
                  <div className="bg-primary/20 text-primary p-4 rounded-lg flex flex-col items-center justify-center min-w-[80px]">
                    <span className="text-xs font-bold uppercase">Nov</span>
                    <span className="text-2xl font-black">24</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">Personal Training</h4>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 07:00 AM</span>
                      <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" /> With David Rivera</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-4 rounded-xl bg-surface border border-white/5 hover:border-primary/50 transition-colors">
                  <div className="bg-white/5 text-gray-400 p-4 rounded-lg flex flex-col items-center justify-center min-w-[80px]">
                    <span className="text-xs font-bold uppercase">Nov</span>
                    <span className="text-2xl font-black">26</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">CrossFit Group Class</h4>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 06:30 PM</span>
                      <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" /> With Sarah Jenkins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 border-white/5 flex flex-col items-center text-center">
                <Activity className="w-6 h-6 text-primary mb-3" />
                <span className="text-2xl font-black text-white mb-1">12</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Workouts<br/>This Month</span>
              </div>
              <div className="glass-card p-6 border-white/5 flex flex-col items-center text-center">
                <Calendar className="w-6 h-6 text-secondary mb-3" />
                <span className="text-2xl font-black text-white mb-1">85%</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Attendance<br/>Rate</span>
              </div>
            </div>

            {/* Payment History */}
            <div className="glass-card p-6 border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Recent Payments</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Elite Plan (Yearly)</p>
                      <p className="text-gray-500 text-xs">Nov 15, 2023</p>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">₹40,000</span>
                </div>
                
                <button className="w-full text-center text-xs font-bold text-primary hover:text-white uppercase tracking-widest transition-colors mt-2">
                  View Full History
                </button>
              </div>
            </div>
            
            {/* Profile Summary */}
            <div className="glass-card p-6 border-white/5">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Profile Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-white font-medium">rahul@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-white font-medium">+91 98765 43210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Joined</span>
                  <span className="text-white font-medium">Jan 2022</span>
                </div>
              </div>
              <button className="w-full bg-surface hover:bg-white/10 text-white py-3 mt-6 rounded-lg font-bold uppercase tracking-wider transition-colors border border-white/5 text-xs">
                Edit Profile
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
