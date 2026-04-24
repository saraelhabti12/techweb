import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import heroVideo from '../../videos/hero.mp4';

const HeroSection = ({ 
    title = "Crafting Digital Masterpieces.", 
    subtitle = "We blend artistic intuition with technical precision to build immersive digital experiences that redefine your brand's future.",
    ctaText = "Start Your Journey",
    ctaLink = "/ContactUs"
}) => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Video with Blur */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
            >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay (Refined for the blue/white/black aesthetic) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505] z-[1]"></div>

            {/* Centered Content */}
            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                {/* Title with Blue-White-Black/Dark Gradient */}
                <h1 className="text-[clamp(3rem,10vw,7.5rem)] font-black leading-[0.95] mb-10 tracking-[-0.03em] uppercase">
                    <span className="bg-gradient-to-r from-[#1F2BF3] via-white to-[#00D8C0] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x block">
                        {title.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span className="bg-gradient-to-r from-[#1F2BF3] via-[#00D8C0] to-[#1F2BF3] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x block">
                        {title.split(' ').slice(2).join(' ')}
                    </span>
                </h1>
                
                {/* Description with better color depth */}
                <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-medium mb-16 leading-relaxed">
                    {subtitle}
                </p>
                
                {/* Button with original Blue-White-Black feel */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                    <Link 
                        href={ctaLink} 
                        className="group relative flex items-center justify-center px-10 py-5 bg-white text-gray-900 dark:bg-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
                    >
                        {/* The "Blue" gradient hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                            {ctaText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>
            </div>

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
