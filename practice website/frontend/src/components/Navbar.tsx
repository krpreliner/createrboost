'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Dumbbell className="text-primary w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-2xl font-bold tracking-wider text-white uppercase">
            Iron <span className="text-primary">Edge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 border-l border-white/20 pl-4">
            <Link
              href="/login"
              className="text-white hover:text-primary transition-colors text-sm uppercase tracking-widest font-bold"
            >
              Login
            </Link>
            <Link
              href="#pricing"
              className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm uppercase tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(255,0,60,0.4)] hover:shadow-[0_0_25px_rgba(255,0,60,0.6)]"
            >
              Join Now
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass flex flex-col items-center py-6 gap-6 md:hidden border-t border-white/10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-primary transition-colors text-lg uppercase tracking-widest font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-primary transition-colors text-lg uppercase tracking-widest font-bold"
            >
              Member Login
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary text-white px-8 py-3 rounded-full text-sm uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(255,0,60,0.4)]"
            >
              Join Now
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
