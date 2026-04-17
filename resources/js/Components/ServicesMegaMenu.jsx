import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  ShoppingCart, 
  Layout, 
  Cpu, 
  Search, 
  Target, 
  TrendingUp, 
  FileText, 
  Palette, 
  Video, 
  Figma, 
  Layers,
  ArrowRight,
  Globe,
  Zap
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const ServicesMegaMenu = ({ isOpen, onClose }) => {
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const categories = [
    {
      title: "WEB SOLUTIONS",
      color: "text-blue-500",
      items: [
        { name: "Website Creation", desc: "Custom-made, high-performance sites.", icon: <Monitor className="w-4 h-4" /> },
        { name: "E-commerce Website", desc: "Scalable online stores.", icon: <ShoppingCart className="w-4 h-4" /> },
        { name: "Landing Pages", desc: "High-converting single pages.", icon: <Layout className="w-4 h-4" /> },
        { name: "Custom Web Apps", desc: "Complex business solutions.", icon: <Cpu className="w-4 h-4" /> }
      ]
    },
    {
      title: "MARKETING SOLUTIONS",
      color: "text-emerald-500",
      items: [
        { name: "SEO Referencing", desc: "Rank higher on Google.", icon: <Search className="w-4 h-4" /> },
        { name: "Advertising & Ads", desc: "Targeted PPC campaigns.", icon: <Target className="w-4 h-4" /> },
        { name: "Social Media Growth", desc: "Build your online community.", icon: <TrendingUp className="w-4 h-4" /> },
        { name: "Content Marketing", desc: "Strategic content creation.", icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: "VISUAL SOLUTIONS",
      color: "text-purple-500",
      items: [
        { name: "Graphic Design", desc: "Creative visuals for print & web.", icon: <Palette className="w-4 h-4" /> },
        { name: "Video Editing", desc: "Engaging video content.", icon: <Video className="w-4 h-4" /> },
        { name: "Branding", desc: "Unique brand identities.", icon: <Layers className="w-4 h-4" /> },
        { name: "UI/UX Design", desc: "Intuitive user experiences.", icon: <Figma className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          className="fixed left-1/2 -translate-x-1/2 top-[72px] z-[100] w-[1100px] max-w-[95vw] pt-2"
        >
          <div className="relative overflow-hidden bg-white/95 dark:bg-[#080808]/95 backdrop-blur-2xl rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            
            {/* Background Decorative Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1F2BF3]/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#00D8C0]/5 to-transparent pointer-events-none" />

            <div className="relative z-10 p-10 lg:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              
              {categories.map((cat, idx) => (
                <motion.div key={idx} variants={columnVariants} className="space-y-8">
                  <h3 className={`text-[10px] font-black tracking-[0.3em] ${cat.color} uppercase opacity-80`}>
                    {cat.title}
                  </h3>
                  <div className="space-y-5">
                    {cat.items.map((item, itemIdx) => (
                      <Link 
                        key={itemIdx}
                        href={route('Services')}
                        onClick={onClose}
                        className="group flex items-start gap-4 transition-all duration-300"
                      >
                        <div className="mt-1 p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 group-hover:bg-gradient-to-br group-hover:from-[#1F2BF3] group-hover:to-[#00D8C0] group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_10px_20px_rgba(31,43,243,0.2)] transition-all duration-300">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#1F2BF3] dark:group-hover:text-[#00D8C0] transition-colors flex items-center justify-between">
                            {item.name}
                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Column 4: About / CTA Block */}
              <motion.div 
                variants={columnVariants}
                className="lg:pl-8 lg:border-l border-gray-100 dark:border-white/5 flex flex-col"
              >
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    Innovating <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]">Digital DNA.</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Techweb combines artistic intuition with technological excellence to scale your vision into a global digital presence.
                  </p>
                  
                  <Link
                    href={route('AboutUs')}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1F2BF3] dark:text-[#00D8C0] hover:gap-4 transition-all duration-300"
                  >
                    The Agency Story <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="mt-8 relative group rounded-3xl overflow-hidden aspect-[4/3] border border-gray-100 dark:border-white/10 shadow-xl">
                  <img 
                    src="/images/service1.jpg" 
                    alt="Work with us" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                      <Globe className="w-3 h-3 text-[#00D8C0]" />
                      Global
                    </div>
                    <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] font-bold text-white uppercase tracking-tighter border border-white/20">
                      Top Rated 2024
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Footer Detail */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex flex-wrap justify-between items-center gap-4">
               <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+25}`} className="w-7 h-7 rounded-full border-2 border-white dark:border-[#080808] shadow-sm" alt="avatar" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Empowering <span className="text-gray-900 dark:text-white">150+ Innovators</span> Worldwide
                  </p>
               </div>
               <Link
                href={route('ContactUs')}
                onClick={onClose}
                className="group px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 flex items-center gap-2"
               >
                Estimate Project
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServicesMegaMenu;
