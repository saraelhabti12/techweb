import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        // 1. Detect mobile/tablet to completely bypass custom cursor and preserve default browser behavior
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Coordinates tracking
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let glowX = -100;
        let glowY = -100;
        
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        const handleMouseOver = (e) => {
            const target = e.target;
            if (!target) return;
            
            const isSelectable = 
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.closest('button') || 
                target.closest('a') ||
                target.closest('.group') || 
                target.classList.contains('cursor-pointer');
            
            setIsHovered(!!isSelectable);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        // 2. High-performance, GPU-accelerated tick loop (Runs on requestAnimationFrame)
        let animationFrameId;
        const updateCursor = () => {
            // Smooth linear interpolation (lerp) for trailing animations
            const ringEase = 0.15; // Smooth lag for outer ring
            const glowEase = 0.08; // Even slower trail for the ambient glow blob
            
            ringX += (mouseX - ringX) * ringEase;
            ringY += (mouseY - ringY) * ringEase;
            
            glowX += (mouseX - glowX) * glowEase;
            glowY += (mouseY - glowY) * glowEase;

            // Direct DOM style updates (bypasses React Virtual DOM state re-renders entirely!)
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
            }
            if (glowRef.current) {
                glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate3d(-50%, -50%, 0)`;
            }

            animationFrameId = requestAnimationFrame(updateCursor);
        };

        animationFrameId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
            {/* 1. Core High-Precision Inner Dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-[#1F2BF3] dark:bg-[#00D8C0] rounded-full shadow-[0_0_10px_rgba(31,43,243,0.5)] dark:shadow-[0_0_10px_rgba(0,216,192,0.5)] pointer-events-none transition-all duration-300 ease-out"
                style={{
                    transform: 'translate3d(-100px, -100px, 0)',
                    willChange: 'transform'
                }}
            />

            {/* 2. Sleek Outer Blurred Ring */}
            <div
                ref={ringRef}
                className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-all duration-300 ease-out ${
                    isClicked 
                        ? 'w-8 h-8 border-[#1F2BF3] dark:border-[#00D8C0] bg-[#1F2BF3]/10 dark:bg-[#00D8C0]/10' 
                        : isHovered 
                            ? 'w-20 h-20 border-[#1F2BF3] dark:border-[#00D8C0] bg-[#1F2BF3]/5 dark:bg-[#00D8C0]/5 backdrop-blur-[1px]' 
                            : 'w-12 h-12 border-[#1F2BF3]/30 dark:border-[#00D8C0]/30 bg-transparent'
                }`}
                style={{
                    transform: 'translate3d(-100px, -100px, 0)',
                    willChange: 'transform'
                }}
            />
            
            {/* 3. Luxury Outer Ambient Glow Blob */}
            <div
                ref={glowRef}
                className={`fixed top-0 left-0 rounded-full blur-[40px] pointer-events-none -z-10 transition-all duration-500 ease-out ${
                    isHovered 
                        ? 'w-48 h-48 bg-[#1F2BF3]/12 dark:bg-[#00D8C0]/12 opacity-100 scale-125' 
                        : 'w-32 h-32 bg-[#1F2BF3]/5 dark:bg-[#00D8C0]/5 opacity-60'
                }`}
                style={{
                    transform: 'translate3d(-100px, -100px, 0)',
                    willChange: 'transform'
                }}
            />
        </div>
    );
}
