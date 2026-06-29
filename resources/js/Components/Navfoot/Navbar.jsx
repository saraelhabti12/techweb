import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from "react";
import { 
    X, 
    User, 
    Sun, 
    Moon,
    ArrowUpRight,
    Instagram,
    Twitter,
    Linkedin,
    ArrowRight,
    ChevronLeft,
    ExternalLink,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    Clock as ClockIcon
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;
    return (
        <motion.div
            style={{ position: "relative" }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

export default function Navbar() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [openFromSection, setOpenFromSection] = useState(null);
    const [isDark, setIsDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(0);
    const [time, setTime] = useState(new Date());
    
    const { component } = usePage();
    const isHomePage = url === '/' || component === 'Welcome' || component === 'HomePage';

    const menuImages = [
        "/images/bgwelcome1.jpg",
        "/images/about1.jpg",
        "/images/SERVICES1.jpg",
        "/images/pro1.jpg",
        "/images/service1.jpg"
    ];

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOpenMenu = () => {
        const currentScroll = window.scrollY;
        
        if (isHomePage) {
            sessionStorage.setItem('lastHomeScroll', currentScroll.toString());
            
            let activeSec = null;
            const sections = ['services', 'about', 'projects'];
            for (const secId of sections) {
                const el = document.getElementById(secId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    if (rect.top <= viewportHeight * 0.8 && rect.bottom >= viewportHeight * 0.2) {
                        activeSec = secId;
                        break;
                    }
                }
            }
            if (activeSec) sessionStorage.setItem('lastHomeSection', activeSec);
            setOpenFromSection(activeSec);
            setLastScrollY(currentScroll);
        } else {
            const savedScroll = sessionStorage.getItem('lastHomeScroll');
            const savedSec = sessionStorage.getItem('lastHomeSection');
            if (savedScroll) setLastScrollY(parseInt(savedScroll));
            if (savedSec) setOpenFromSection(savedSec);
        }
        
        setIsMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
            setTimeout(() => setIsMenuOpen(false), 100);
        } else {
            setIsMenuOpen(false);
            if (isHomePage) {
                setTimeout(() => {
                    window.scrollTo({
                        top: lastScrollY,
                        behavior: 'smooth'
                    });
                }, 300);
            } else {
                sessionStorage.setItem('shouldRestoreScroll', 'true');
                window.location.href = '/';
            }
        }
    };

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setScrolled(currentScrollY > 50);
            
            if (isHomePage && !isMenuOpen) {
                sessionStorage.setItem('lastHomeScroll', currentScrollY.toString());
            }
        };
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, isHomePage]);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark(!isDark);
    };

    const forceWhite = scrolled || (isHomePage && scrollY < 500) || isDark;
    const effectiveForceWhite = isMenuOpen ? isDark : forceWhite;

    const navItems = [
        { name: t('home'), href: "/", label: "Where we begin" },
        { name: t('about'), href: "/AboutUs", label: "Who we are" },
        { name: t('services'), href: "/Services", label: "What we do" },
        { name: t('projects'), href: "/Projects", label: "What we've built" },
        { name: t('contact'), href: "/ContactUs", label: "Let's talk" }
    ];

    const renderNavItem = (item, i) => {
        const isActive = hoveredIndex === i;
        const classes = `group flex items-center justify-between w-full py-8 border-b border-gray-100 dark:border-white/5 transition-all duration-500 ${isActive ? 'pl-4' : ''}`;

        const content = (
            <>
                <div className="relative">
                    <motion.div 
                        initial={false}
                        animate={{ 
                            width: isActive ? '100%' : '0%',
                            opacity: isActive ? 1 : 0
                        }}
                        className="absolute -top-4 left-0 h-[1px] bg-[#1F2BF3] dark:bg-[#00D8C0]"
                    />
                    <span className={`text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter transition-all duration-500 ${
                        isActive 
                            ? "text-[#1F2BF3] dark:text-[#00D8C0] scale-105" 
                            : "text-gray-900 dark:text-white/40 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}>
                        {item.name}
                    </span>
                    <div className={`flex items-center gap-3 mt-2 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-white/30">
                            {item.label}
                        </span>
                    </div>
                </div>
                <div className={`relative w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
                    isActive 
                        ? 'bg-[#1F2BF3] dark:bg-[#00D8C0] border-transparent rotate-45' 
                        : 'border-gray-200 dark:border-white/10 group-hover:border-gray-900 dark:group-hover:border-white'
                }`}>
                    <ArrowUpRight className={`w-5 h-5 transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-300 dark:text-white/20'}`} />
                </div>
            </>
        );

        if (isHomePage && item.href === '/') {
            return (
                <button 
                    onMouseEnter={() => setHoveredIndex(i)} 
                    onClick={handleBack} 
                    className={classes}
                >
                    {content}
                </button>
            );
        }
        return (
            <Link 
                href={item.href} 
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => setIsMenuOpen(false)} 
                className={classes}
            >
                {content}
            </Link>
        );
    };

    return (
        <>
            <div className="grain-overlay" />
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-out ${
                    scrolled 
                        ? "py-4 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-b-2xl" 
                        : "py-8 bg-transparent"
                }`}
            >
                <div className="max-w-[95rem] mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <Link href="/" className="relative z-[110] group">
                        <img 
                            className={`h-8 w-auto transition-transform duration-500 group-hover:scale-110 ${effectiveForceWhite ? 'hidden' : 'block dark:hidden'}`} 
                            src="/images/logotechweb.png" 
                            alt="TechWeb" 
                        />
                        <img 
                            className={`h-8 w-auto transition-transform duration-500 group-hover:scale-110 ${effectiveForceWhite ? 'block' : 'hidden dark:block'}`} 
                            src="/images/logo3.png" 
                            alt="TechWeb" 
                        />
                    </Link>

                    <div className="flex items-center gap-8 relative z-[110]">
                        <LanguageSwitcher forceWhite={effectiveForceWhite} />
                        
                        <button 
                            onClick={toggleDarkMode} 
                            className={`transition-colors duration-300 ${effectiveForceWhite ? 'text-white' : 'text-gray-900 dark:text-white'} hover:text-[#1F2BF3]`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        <Link 
                            href={auth?.user ? route('dashboard') : route('login')} 
                            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 group ${
                                effectiveForceWhite 
                                    ? 'border-white/20 text-white hover:border-white' 
                                    : 'border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:border-[#1F2BF3] hover:text-[#1F2BF3]'
                            }`}
                        >
                            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Link>

                        <button 
                            onClick={() => isMenuOpen ? handleCloseMenu() : handleOpenMenu()}
                            className={`group flex items-center gap-4 px-6 py-3 rounded-full overflow-hidden transition-all duration-500 active:scale-95 shadow-lg ${
                                effectiveForceWhite
                                    ? 'bg-white text-gray-900'
                                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            }`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10 pl-2">
                                {isMenuOpen ? "CLOSE" : "MENU"}
                            </span>
                            <div className="flex flex-col gap-1.5 relative z-10 w-6">
                                <motion.div animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 4 : 0 }} className={`w-full h-[1.5px] ${effectiveForceWhite ? 'bg-gray-900' : 'bg-white'}`} />
                                <motion.div animate={{ opacity: isMenuOpen ? 0 : 1 }} className={`w-full h-[1.5px] ${effectiveForceWhite ? 'bg-gray-900' : 'bg-white'}`} />
                                <motion.div animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -4 : 0 }} className={`w-full h-[1.5px] ${effectiveForceWhite ? 'bg-gray-900' : 'bg-white'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[105] bg-white dark:bg-[#080808] overflow-hidden"
                    >
                        <div className="flex h-full">
                            {/* Left Side - Dynamic Canvas */}
                            <div className="hidden lg:block w-[40%] h-full relative overflow-hidden bg-gray-100 dark:bg-[#0A0A0A]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={hoveredIndex}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                        className="absolute inset-0"
                                    >
                                        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-10" />
                                        <img 
                                            src={menuImages[hoveredIndex]} 
                                            className="w-full h-full object-cover" 
                                            alt="Preview"
                                        />
                                        
                                        {/* Decorative elements */}
                                        <div className="absolute bottom-12 left-12 z-20">
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="w-12 h-px bg-white/50" />
                                                <span className="text-[10px] font-mono text-white/70 uppercase tracking-[0.4em]">
                                                    Phase 0{hoveredIndex + 1}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Right Side - Links */}
                            <div className="flex-1 flex flex-col px-8 lg:px-20 h-full overflow-y-auto">
                                {/* Top bar */}
                                <div className="flex items-center justify-between pt-8 lg:pt-12 pb-6 flex-shrink-0">
                                    <Magnetic>
                                        <button
                                            onClick={handleBack}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group p-4"
                                        >
                                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            Back
                                        </button>
                                    </Magnetic>
                                    <Magnetic>
                                        <button
                                            onClick={handleCloseMenu}
                                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-4"
                                        >
                                            Close
                                        </button>
                                    </Magnetic>
                                </div>

                                {/* Nav items */}
                                <div className="flex-1 flex flex-col justify-center py-12">
                                    <div className="space-y-0">
                                        {navItems.map((item, i) => (
                                            <motion.div
                                                key={item.name}
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + (i * 0.08), duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                            >
                                                {renderNavItem(item, i)}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom bar */}
                                <div className="py-12 border-t border-gray-100 dark:border-white/5 flex-shrink-0">
                                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-8">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Connect</span>
                                            <div className="flex items-center gap-6">
                                                <a href="mailto:contact@techweb.ma" className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#1F2BF3] dark:hover:text-[#00D8C0] transition-colors">contact@techweb.ma</a>
                                                <div className="flex items-center gap-4">
                                                    {[Instagram, Twitter, Linkedin].map((Icon, idx) => (
                                                        <a key={idx} href="#" className="text-gray-400 hover:text-[#1F2BF3] dark:hover:text-[#00D8C0] transition-colors">
                                                            <Icon className="w-4 h-4" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12 text-right">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Location</span>
                                                <div className="flex items-center gap-2 justify-end">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Tangier, MAR</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Local Time</span>
                                                <div className="flex items-center gap-2 justify-end text-sm font-bold text-gray-900 dark:text-white">
                                                    <ClockIcon className="w-3.5 h-3.5" />
                                                    {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
