'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function MembersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersRes = await fetch('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (usersRes.ok) {
          setUsers(await usersRes.json());
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return <div className="text-white text-center py-20 font-bold uppercase tracking-widest">Loading Members...</div>;
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 bg-surface hover:bg-white/10 rounded-lg text-white transition-colors border border-white/5">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">All Members</h1>
          <p className="text-gray-400">Manage all registered gym members</p>
        </div>
      </div>

      <div className="glass-card p-6 border-white/5">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Total: {filteredUsers.length}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider bg-surface/50">
                <th className="py-4 px-4 font-medium rounded-tl-lg">Name</th>
                <th className="py-4 px-4 font-medium">Email</th>
                <th className="py-4 px-4 font-medium">Phone</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium rounded-tr-lg">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((member) => (
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
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No members found matching "{search}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
