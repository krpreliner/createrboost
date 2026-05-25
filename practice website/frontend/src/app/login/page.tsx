'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        
        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemo = () => {
    setEmail('admin@ironedgegym.com');
    setPassword('password123');
  };

  const handleMemberDemo = () => {
    setEmail('rahul@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="glass-card p-10 w-full max-w-md border-white/5 relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="text-primary w-8 h-8" />
            <span className="text-2xl font-black tracking-wider text-white uppercase">
              Iron <span className="text-primary">Edge</span>
            </span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white uppercase tracking-wider text-center mb-8">Login to your account</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-500 text-sm font-bold p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="admin@ironedgegym.com"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-red-600 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(255,0,60,0.3)] mt-4"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center flex flex-col gap-3">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Demo Logins</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              type="button"
              onClick={handleAdminDemo}
              className="text-primary hover:text-white text-sm font-bold uppercase tracking-wider transition-colors border border-primary/30 hover:border-white px-4 py-2 rounded-lg"
            >
              Load Admin
            </button>
            <button 
              type="button"
              onClick={handleMemberDemo}
              className="text-secondary hover:text-white text-sm font-bold uppercase tracking-wider transition-colors border border-secondary/30 hover:border-white px-4 py-2 rounded-lg"
            >
              Load Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
