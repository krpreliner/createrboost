'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-surface-light relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-widest mb-2"
          >
            Get In Touch
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight"
          >
            Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Iron Edge</span>
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="glass-card p-8 border-white/5">
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Location</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      SBI Bank, Near Naro, Piska Nagri Rd,<br />
                      Ranchi, Jharkhand 835303
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Phone</h4>
                    <p className="text-gray-400 text-sm">+91 62023 56575</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Email</h4>
                    <p className="text-gray-400 text-sm">info@ironedgegym.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="bg-surface p-3 rounded-full text-white hover:bg-primary hover:text-white transition-colors">
                    <InstagramIcon />
                  </a>
                  <a href="#" className="bg-surface p-3 rounded-full text-white hover:bg-primary hover:text-white transition-colors">
                    <FacebookIcon />
                  </a>
                  <a href="#" className="bg-surface p-3 rounded-full text-white hover:bg-primary hover:text-white transition-colors">
                    <TwitterIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden h-64 border border-white/5 relative bg-surface">
              <iframe 
                src="https://maps.google.com/maps?q=SBI%20Bank,%20Near%20Naro,%20Piska%20Nagri%20Rd,%20Ranchi,%20Jharkhand%20835303&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="glass-card p-8 border-white/5 h-full">
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Send Us A Message</h3>
              
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="YOUR NAME" 
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm uppercase tracking-widest font-bold"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS" 
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm uppercase tracking-widest font-bold"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="PHONE NUMBER" 
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm uppercase tracking-widest font-bold"
                  />
                </div>
                <div>
                  <select className="w-full bg-background border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm uppercase tracking-widest font-bold appearance-none">
                    <option value="" disabled selected>INTERESTED IN...</option>
                    <option value="membership">Membership Plans</option>
                    <option value="personaltraining">Personal Training</option>
                    <option value="freetrial">Free Trial</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
                <div>
                  <textarea 
                    placeholder="MESSAGE" 
                    rows={4}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm uppercase tracking-widest font-bold resize-none"
                  ></textarea>
                </div>
                <button className="w-full bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest py-4 rounded-lg transition-all">
                  Send Message
                </button>
                
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <span className="relative bg-surface-light px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or Connect Via</span>
                </div>

                <a 
                  href="https://wa.me/916202356575?text=Hello%20Iron%20Edge%20Gym,%20I%20want%20to%20know%20about%20membership%20plans." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(37,211,102,0.3)]"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
