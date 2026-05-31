import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Zap, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import heroVideo from '../../videos/hero.mp4';

const HeroSection = ({ 
    title = "Crafting Digital Masterpieces.", 
    subtitle = "We blend artistic intuition with technical precision to build immersive digital experiences that redefine your brand's future.",
    ctaText = "Start Your Journey",
    ctaLink = "/ContactUs"
}) => {
    // Elegant container stagger variant
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.0,
                ease: [0.16, 1, 0.3, 1] // Super premium custom cubic bezier curve
            }
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Video with Blur */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover blur-[8px] scale-110"
            >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#050505] z-[1]"></div>
            
            {/* Login-style ambient glows for consistency */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
                <motion.div 
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1F2BF3]/20 blur-[120px] rounded-full opacity-50" 
                />
                <motion.div 
                    animate={{
                        scale: [1.1, 0.95, 1.1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[#00D8C0]/20 blur-[120px] rounded-full" 
                />
                
                {/* Large Subtle Icons */}
                <div className="absolute top-[20%] right-[10%] opacity-[0.03] dark:opacity-[0.07] rotate-12">
                    <Zap size={400} className="text-[#1F2BF3]" />
                </div>
                <div className="absolute bottom-[20%] left-[5%] opacity-[0.03] dark:opacity-[0.07] -rotate-12">
                    <Rocket size={300} className="text-[#00D8C0]" />
                </div>
            </div>

            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-[3] mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Centered Content */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center px-6 max-w-6xl mx-auto flex flex-col items-center"
            >
                {/* Micro-badge with continuous float */}
                <motion.div
                    variants={itemVariants}
                    animate={{
                        y: [0, -6, 0],
                    }}
                    transition={{
                        y: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-lg shadow-black/10 select-none group/badge"
                >
                    <span className="w-2 h-2 rounded-full bg-[#00D8C0] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">TECHWEB AGENCY 2.0</span>
                </motion.div>

                {/* Title with Blue-White-Black/Dark Gradient and 3D rise transition */}
                <motion.h1 
                    variants={{
                        hidden: { opacity: 0, y: 60, rotateX: 6 },
                        visible: { 
                            opacity: 1, 
                            y: 0, 
                            rotateX: 0,
                            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                        }
                    }}
                    className="text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.95] mb-8 tracking-[-0.03em] uppercase max-w-5xl [perspective:1000px]"
                >
                    <span className="bg-gradient-to-r from-[#1F2BF3] via-white to-[#00D8C0] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x block">
                        {title.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span className="bg-gradient-to-r from-[#1F2BF3] via-[#00D8C0] to-[#1F2BF3] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x block">
                        {title.split(' ').slice(2).join(' ')}
                    </span>
                </motion.h1>
                
                {/* Description with better color depth */}
                <motion.p 
                    variants={itemVariants}
                    className="text-base lg:text-lg text-gray-400 max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
                >
                    {subtitle}
                </motion.p>
                
                {/* Button with original Blue-White-Black feel and glowing hover aura */}
                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-8 relative group"
                >
                    {/* Glowing dynamic background aura */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-full blur-xl opacity-20 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                    
                    <Link 
                        href={ctaLink} 
                        className="group relative flex items-center justify-center px-10 py-5 bg-white text-gray-900 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
                    >
                        {/* The "Blue" gradient hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                            {ctaText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Bottom Gradient for smooth transition */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-[2]"></div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    animation: gradient-x 10s ease infinite;
                }
            `}} />
        </section>
    );
};

export default HeroSection;
