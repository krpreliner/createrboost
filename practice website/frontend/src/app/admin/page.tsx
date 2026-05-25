'use client';

import { Users, CreditCard, Activity, TrendingUp, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', phone: '', planName: 'Elite Yearly' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersRes = await fetch('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statsRes.ok && usersRes.ok) {
          setStats(await statsRes.json());
          setUsers(await usersRes.json());
        } else {
          // Token might be expired or invalid
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newMember)
      });
      
      const data = await res.json();
      if (res.ok) {
        // Add user to local list directly
        setUsers([data, ...users]);
        setShowAddModal(false);
        setNewMember({ name: '', email: '', password: '', phone: '', planName: 'Elite Yearly' });
        // Update stats
        setStats({ ...stats, totalUsers: (stats?.totalUsers || 0) + 1, activeMembers: (stats?.activeMembers || 0) + 1 });
      } else {
        setFormError(data.message || 'Failed to add member');
      }
    } catch (error) {
      setFormError('Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20 font-bold uppercase tracking-widest">Loading Dashboard...</div>;
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats?.totalUsers || 0,
      change: "Active in database",
      icon: <Users className="w-8 h-8 text-primary" />,
      positive: true
    },
    {
      title: "Active Memberships",
      value: stats?.activeMembers || 0,
      change: "Currently Active",
      icon: <Activity className="w-8 h-8 text-secondary" />,
      positive: true
    },
    {
      title: "Revenue (INR)",
      value: `₹${stats?.revenue?.toLocaleString() || 0}`,
      change: "Based on active plans",
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      positive: true
    },
    {
      title: "Pending Payments",
      value: "15", // Mock value as per requested skipping of payments
      change: "-2% from last month",
      icon: <CreditCard className="w-8 h-8 text-red-500" />,
      positive: false
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back, Admin. Here's your live gym data.</p>
        </div>
        <button className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-surface p-3 rounded-xl border border-white/5">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{stat.title}</h3>
            <p className="text-3xl font-black text-white mb-2">{stat.value}</p>
            <p className={`text-xs ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Members Table */}
        <div className="lg:col-span-2 glass-card p-6 border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Registered Members</h2>
            <Link href="/admin/members" className="text-primary hover:text-white transition-colors text-sm font-bold">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="pb-3 px-4 font-medium">Name</th>
                  <th className="pb-3 px-4 font-medium">Email</th>
                  <th className="pb-3 px-4 font-medium">Phone</th>
                  <th className="pb-3 px-4 font-medium">Status</th>
                  <th className="pb-3 px-4 font-medium">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((member) => (
                  <tr key={member._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-white font-medium">{member.name}</td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{member.email}</td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{member.phone || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full uppercase font-bold ${
                        member.membershipStatus === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{new Date(member.joiningDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="space-y-8">
          <div className="glass-card p-6 border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-full bg-surface hover:bg-white/10 text-left px-4 py-3 rounded-lg text-gray-300 transition-colors border border-white/5 flex items-center gap-3"
              >
                <Users className="w-5 h-5 text-primary" />
                Add New Member
              </button>
              <button className="w-full bg-surface hover:bg-white/10 text-left px-4 py-3 rounded-lg text-gray-300 transition-colors border border-white/5 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                Record Payment
              </button>
              <button className="w-full bg-surface hover:bg-white/10 text-left px-4 py-3 rounded-lg text-gray-300 transition-colors border border-white/5 flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] border border-white/10 p-8 rounded-2xl w-full max-w-md relative"
          >
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-6 text-center">Add Member</h2>
            
            {formError && (
              <div className="bg-red-500/20 text-red-500 border border-red-500/50 p-3 rounded-lg text-sm font-bold text-center mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Email</label>
                <input 
                  required 
                  type="email" 
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Temporary Password</label>
                <input 
                  required 
                  type="text" 
                  value={newMember.password}
                  onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                  className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 block">Phone</label>
                <input 
                  type="text" 
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-red-600 text-white font-bold uppercase py-3 rounded-lg mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
