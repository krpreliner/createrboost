'use client';

import { motion } from 'framer-motion';
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

export default function TrainersSection() {
  const trainers = [
    {
      name: "Marcus Cole",
      specialty: "Head Strength Coach",
      image: "https://images.unsplash.com/photo-1567598508481-65985588e295?q=80&w=600&auto=format&fit=crop",
      socials: {
        instagram: "#",
        twitter: "#",
        facebook: "#"
      }
    },
    {
      name: "Sarah Jenkins",
      specialty: "CrossFit & HIIT",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop",
      socials: {
        instagram: "#",
        twitter: "#",
        facebook: "#"
      }
    },
    {
      name: "David Rivera",
      specialty: "Bodybuilding Pro",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
      socials: {
        instagram: "#",
        twitter: "#",
        facebook: "#"
      }
    },
    {
      name: "Emma Watson",
      specialty: "Yoga & Mobility",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
      socials: {
        instagram: "#",
        twitter: "#",
        facebook: "#"
      }
    }
  ];

  return (
    <section id="trainers" className="py-24 bg-surface relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-widest mb-2"
          >
            Expert Team
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight"
          >
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Trainers</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden bg-background border border-white/5"
            >
              <div className="relative h-[350px] overflow-hidden">
                <img 
                  src={trainer.image} 
                  alt={trainer.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                />
                
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a href={trainer.socials.instagram} className="bg-primary/90 text-white p-3 rounded-full hover:bg-white hover:text-primary transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                    <InstagramIcon />
                  </a>
                  <a href={trainer.socials.twitter} className="bg-primary/90 text-white p-3 rounded-full hover:bg-white hover:text-primary transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150">
                    <TwitterIcon />
                  </a>
                  <a href={trainer.socials.facebook} className="bg-primary/90 text-white p-3 rounded-full hover:bg-white hover:text-primary transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-200">
                    <FacebookIcon />
                  </a>
                </div>
              </div>

              <div className="p-6 text-center border-t-2 border-t-transparent group-hover:border-t-primary transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">{trainer.name}</h3>
                <span className="inline-block bg-surface-light text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {trainer.specialty}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
