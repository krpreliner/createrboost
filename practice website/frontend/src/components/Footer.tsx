'use client';

import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <Dumbbell className="text-primary w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-bold tracking-wider text-white uppercase">
                Iron <span className="text-primary">Edge</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Ranchi's premier fitness destination combining luxury aesthetics with hardcore training principles. Push beyond your limits with Iron Edge Gym.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 border-l-2 border-primary pl-3">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#about" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">About Us</Link></li>
              <li><Link href="#programs" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">Programs</Link></li>
              <li><Link href="#trainers" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">Trainers</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">Memberships</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 border-l-2 border-primary pl-3">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#contact" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">FAQs</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 border-l-2 border-primary pl-3">Opening Hours</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Monday - Friday</span>
                <span className="text-white font-bold">5:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Saturday</span>
                <span className="text-white font-bold">6:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Sunday</span>
                <span className="text-primary font-bold">7:00 AM - 2:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Iron Edge Gym. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Designed with <span className="text-primary">&hearts;</span> for fitness enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
