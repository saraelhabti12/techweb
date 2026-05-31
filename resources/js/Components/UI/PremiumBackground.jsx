import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
    Code2, 
    Layout, 
    MousePointer2, 
    Play, 
    Cloud, 
    BarChart3, 
    Sparkles, 
    PenTool, 
    Globe,
    Cpu,
    Shield
} from "lucide-react";

// Helper to generate consistent random values based on index
const getPseudoRandom = (index, min, max) => {
    const seed = index * 13.5;
    const x = Math.sin(seed) * 10000;
    const random = x - Math.floor(x);
    return random * (max - min) + min;
};

const FloatingIcon = ({ icon: Icon, index, mouseX, mouseY, isMobile }) => {
    // Drastically reduce icons on mobile
    if (isMobile && index % 3 !== 0) return null;

    const initialX = useMemo(() => getPseudoRandom(index, 5, 95), [index]);
    const initialY = useMemo(() => getPseudoRandom(index + 10, 5, 95), [index]);
    const rotate = useMemo(() => getPseudoRandom(index + 20, -30, 30), [index]);
    const scale = useMemo(() => getPseudoRandom(index + 30, 0.8, 1.2), [index]);
    const delay = useMemo(() => getPseudoRandom(index + 40, 0, 5), [index]);
    const duration = useMemo(() => getPseudoRandom(index + 50, 15, 25), [index]);
    const size = useMemo(() => getPseudoRandom(index + 60, 40, 80), [index]);
    
    // Parallax factor - icons at different depths
    const depth = useMemo(() => getPseudoRandom(index + 70, 0.03, 0.08), [index]);

    // Use simpler transform on mobile
    const x = useTransform(mouseX, [0, 1920], [initialX - (30 * depth), initialX + (30 * depth)], { clamp: false });
    const y = useTransform(mouseY, [0, 1080], [initialY - (30 * depth), initialY + (30 * depth)], { clamp: false });

    return (
        <motion.div
            style={{ 
                left: `${initialX}%`, 
                top: `${initialY}%`,
                x, 
                y, 
                rotate, 
                scale,
                opacity: isMobile ? 0.03 : 0.05
            }}
            animate={{
                y: [0, -getPseudoRandom(index, 10, 30), 0],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className="absolute text-[#1F2BF3] dark:text-[#1F2BF3] blur-[0.2px] pointer-events-none select-none z-0 will-change-transform"
        >
            <Icon size={isMobile ? size * 0.7 : size} strokeWidth={1} />
        </motion.div>
    );
};

export default function PremiumBackground({ variant = 'default' }) {
    const [isMobile, setIsMobile] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Damping and stiffness for smoother, less heavy parallax
    const smoothMouseX = useSpring(mouseX, { damping: 60, stiffness: 150 });
    const smoothMouseY = useSpring(mouseY, { damping: 60, stiffness: 150 });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e) => {
            // Only track if not on mobile to save performance
            if (window.innerWidth >= 1024) {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            }
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseX, mouseY]);

    const icons = useMemo(() => [
        Code2, Layout, MousePointer2, Play, Cloud, BarChart3, Sparkles, PenTool, Globe, Cpu, Shield
    ], []);

    // Parallax for blobs - reduced range for better performance
    const blob1X = useTransform(smoothMouseX, [0, 1920], [-25, 25]);
    const blob1Y = useTransform(smoothMouseY, [0, 1080], [-25, 25]);
    
    const blob2X = useTransform(smoothMouseX, [0, 1920], [25, -25]);
    const blob2Y = useTransform(smoothMouseY, [0, 1080], [25, -25]);

    return (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none select-none">
            {/* NOISE OVERLAY - Reduced opacity and hidden on low-end/mobile if needed */}
            {!isMobile && (
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] z-[100] pointer-events-none"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            )}

            {/* BASE BACKGROUND */}
            <div className="absolute inset-0 bg-white dark:bg-[#030303] transition-colors duration-700" />

            {/* SUBTLE GRID - Simpler mask for better perf */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] z-0" 
                 style={{ 
                    backgroundImage: `linear-gradient(#1F2BF3 1px, transparent 1px), linear-gradient(90deg, #1F2BF3 1px, transparent 1px)`, 
                    backgroundSize: isMobile ? '40px 40px' : '60px 60px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 85%)'
                 }} />

            {/* AMBIENT LIGHT BEAMS - Simplified for mobile */}
            {!isMobile && (
                <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08] z-0">
                    <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#1F2BF3] to-transparent blur-[2px]" />
                    <div className="absolute top-0 right-[25%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#00D8C0] to-transparent blur-[2px]" />
                </div>
            )}

            {/* FLOATING ICONS */}
            <div className="absolute inset-0 z-0">
                {icons.map((Icon, i) => (
                    <FloatingIcon 
                        key={i} 
                        icon={Icon} 
                        index={i}
                        mouseX={smoothMouseX}
                        mouseY={smoothMouseY}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            {/* AMBIENT BLOBS - Reduced blur radius for massive GPU gains */}
            <div className="absolute inset-0 z-0">
                {/* Royal Blue Orb */}
                <motion.div 
                    style={{ x: blob1X, y: blob1Y }}
                    className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-[#1F2BF3]/20 to-[#7C3AED]/10 rounded-full blur-[80px] lg:blur-[120px] mix-blend-screen dark:mix-blend-lighten will-change-transform"
                />
                
                {/* Cyber Teal Orb */}
                <motion.div 
                    style={{ x: blob2X, y: blob2Y }}
                    className="absolute bottom-[-15%] right-[-10%] w-[75vw] h-[75vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-[#00D8C0]/20 to-[#1F2BF3]/10 rounded-full blur-[90px] lg:blur-[130px] mix-blend-screen dark:mix-blend-lighten will-change-transform"
                />

                {(variant === 'mesh' || variant === 'projects') && (
                    <motion.div 
                        style={{ x: blob2X, y: blob1Y }}
                        className="absolute top-[30%] right-[10%] w-[55vw] h-[55vw] max-w-[500px] max-h-[500px] bg-[#7C3AED]/12 dark:bg-[#7C3AED]/15 rounded-full blur-[70px] lg:blur-[110px] mix-blend-soft-light will-change-transform"
                    />
                )}
            </div>

            {/* SPECIAL PROJECTS SECTION ELEMENTS */}
            {variant === 'projects' && (
                <div className="absolute inset-0 z-[1]">
                    {/* Slow shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1F2BF3]/3 via-transparent to-[#00D8C0]/3 animate-pulse duration-[10s]" />
                    
                    {/* Moving Glowing Lines - Optimized for performance */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                         {!isMobile && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1F2BF3] to-transparent animate-scanline" style={{ animationDelay: '0s' }} />}
                         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00D8C0] to-transparent animate-scanline" style={{ animationDelay: '4s', animationDuration: '10s' }} />
                    </div>

                    {/* Digital Mesh Dots */}
                    <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05]" 
                         style={{ 
                            backgroundImage: `radial-gradient(#1F2BF3 1px, transparent 1px)`, 
                            backgroundSize: '32px 32px',
                            maskImage: 'radial-gradient(circle at center, black, transparent 75%)'
                         }} 
                    />
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scanline {
                    0% { transform: translateY(-50px); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(105vh); opacity: 0; }
                }
                .animate-scanline { animation: scanline 15s linear infinite; }
            `}} />
        </div>
    );
}
