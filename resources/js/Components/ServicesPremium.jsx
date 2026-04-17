import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  ShoppingCart, 
  Layout, 
  Search, 
  Target, 
  TrendingUp, 
  Palette, 
  Video, 
  Figma, 
  ArrowRight,
  MonitorCheck,
  Rocket,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const ServicesPremium = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const services = [
    {
      title: "Web Solutions",
      color: "from-blue-600 to-indigo-600",
      items: [
        { icon: <MonitorCheck className="w-5 h-5" />, name: "Custom Website Creation", desc: "Tailored digital experiences built for performance." },
        { icon: <ShoppingCart className="w-5 h-5" />, name: "E-commerce Development", desc: "Scale your sales with robust online store solutions." },
        { icon: <Layout className="w-5 h-5" />, name: "Landing Pages", desc: "High-converting pages designed to capture leads." }
      ]
    },
    {
      title: "Marketing Solutions",
      color: "from-emerald-500 to-teal-500",
      items: [
        { icon: <Search className="w-5 h-5" />, name: "SEO Optimization", desc: "Rank higher on search engines and attract organic traffic." },
        { icon: <Target className="w-5 h-5" />, name: "Ads Campaigns", desc: "Targeted PPC and social media ads for maximum ROI." },
        { icon: <TrendingUp className="w-5 h-5" />, name: "Social Media Growth", desc: "Build a community and boost your brand authority." }
      ]
    },
    {
      title: "Creative / Visual",
      color: "from-purple-600 to-pink-600",
      items: [
        { icon: <Palette className="w-5 h-5" />, name: "Branding Design", desc: "Unique identity systems that tell your brand story." },
        { icon: <Video className="w-5 h-5" />, name: "Video Editing", desc: "Compelling motion content for social and web." },
        { icon: <Figma className="w-5 h-5" />, name: "UI/UX Design", desc: "User-centric interfaces that are intuitive and beautiful." }
      ]
    }
  ];

  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden font-quicksand">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#1F2BF3]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#00D8C0]/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1F2BF3]/20 bg-[#1F2BF3]/5 text-[#1F2BF3] text-xs font-bold tracking-widest uppercase mb-4">
            Our Expertise
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]">Digital Services</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            We combine strategic thinking with cutting-edge technology to deliver exceptional results that move your business forward.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((column, idx) => (
            <motion.div key={idx} variants={itemVariants} className="space-y-8">
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center group">
                  <span className={`w-8 h-[2px] bg-gradient-to-r ${column.color} mr-3 transition-all duration-300 group-hover:w-12`} />
                  {column.title}
                </h3>
                
                <div className="space-y-6">
                  {column.items.map((item, itemIdx) => (
                    <motion.div 
                      key={itemIdx}
                      whileHover={{ x: 8 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white transition-all duration-300 group-hover:bg-gradient-to-br group-hover:shadow-[0_0_20px_rgba(31,43,243,0.3)] ${column.color.replace('from-', 'group-hover:from-').replace('to-', 'group-hover:to-')}`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1 group-hover:text-[#00D8C0] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Column 4: About / CTA Block */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden group">
              {/* Background Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1F2BF3] to-[#7C3AED] opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-white/10 group-hover:border-[#1F2BF3]/50 transition-colors duration-500 rounded-3xl" />
              
              <div className="relative p-8 h-full flex flex-col justify-between z-10">
                <div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <Rocket className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                    Ready to elevate your <span className="text-[#00D8C0]">digital presence?</span>
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-8">
                    Techweb is a boutique digital agency focused on delivering high-end solutions for forward-thinking brands. We don't just build websites; we create growth engines.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Floating visual elements */}
                  <div className="flex -space-x-3 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] overflow-hidden bg-gray-800">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                          alt="Team" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#050505] bg-[#00D8C0] flex items-center justify-center text-[10px] font-bold text-black">
                      +12
                    </div>
                  </div>

                  <Link
                    href={route('ContactUs')}
                    className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-white text-black font-bold group/btn overflow-hidden relative transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start Your Project
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00D8C0] to-[#1F2BF3] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  </Link>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00D8C0]/30 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#00D8C0]/50 transition-colors duration-500" />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom trust badges or small detail */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Guaranteed Security</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Zap className="w-5 h-5" />
            <span>Lightning Fast Load</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Target className="w-5 h-5" />
            <span>Result Oriented</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Globe className="w-5 h-5" />
            <span>Global Delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPremium;
