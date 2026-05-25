import { Dumbbell, LayoutDashboard, Users, CreditCard, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-light border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-white/10">
          <Dumbbell className="text-primary w-6 h-6" />
          <span className="text-xl font-bold tracking-wider text-white uppercase">
            Admin <span className="text-primary">Panel</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary/20 text-primary rounded-lg font-bold">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/members" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Users className="w-5 h-5" />
            Members
          </Link>
          <Link href="/admin/payments" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <CreditCard className="w-5 h-5" />
            Payments
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
