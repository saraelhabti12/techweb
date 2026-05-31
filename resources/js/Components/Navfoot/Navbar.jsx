import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { 
    X, 
    User, 
    Sun, 
    Moon,
    ArrowUpRight,
    Instagram,
    Twitter,
    Linkedin,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

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
    
    const { component } = usePage();
    const isHomePage = url === '/' || component === 'Welcome' || component === 'HomePage';

    const handleOpenMenu = () => {
        const currentScroll = window.scrollY;
        
        // If on homepage, update the persistent scroll record
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
            // If on other page, try to retrieve the record
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
        setIsMenuOpen(false);
        
        if (isHomePage) {
            // Already on home, just scroll
            setTimeout(() => {
                window.scrollTo({
                    top: lastScrollY,
                    behavior: 'smooth'
                });
            }, 300);
        } else {
            // Navigate to home and then scroll
            // We use a query param or just rely on the homepage effect reading sessionStorage
            sessionStorage.setItem('shouldRestoreScroll', 'true');
            window.location.href = '/';
        }
    };

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setScrolled(currentScrollY > 50);
            
            // Continuous tracking on homepage to make navigation "back" from other pages accurate
            if (isHomePage && !isMenuOpen) {
                sessionStorage.setItem('lastHomeScroll', currentScrollY.toString());
            }
        };
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        
        // Prevent scroll when menu is open
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

    // Logic to force white logo/icons:
    // 1. If we are in glass mode (scrolled)
    // 2. If we are at the top of the homepage (Hero is dark)
    // 3. If we are in global dark mode
    const forceWhite = scrolled || (isHomePage && scrollY < 500) || isDark;
    
    // When menu is open, we follow the theme background (white in light, dark in dark)
    const effectiveForceWhite = isMenuOpen ? isDark : forceWhite;

    const menuVariants = {
        closed: {
            y: "-100%",
            transition: { 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1],
                when: "afterChildren"
            }
        },
        open: {
            y: "0%",
            transition: { 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1],
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        closed: { x: -50, opacity: 0 },
        open: i => ({
            x: 0,
            opacity: 1,
            transition: { 
                delay: 0.3 + (i * 0.1), 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] 
            }
        })
    };

    const infoVariants = {
        closed: { opacity: 0, y: 20 },
        open: { 
            opacity: 1, 
            y: 0, 
            transition: { delay: 0.7, duration: 0.6 } 
        }
    };

    const navItems = [
        { name: t('home'), href: "/" },
        { name: t('about'), href: "/AboutUs" },
        { name: t('services'), href: "/Services" },
        { name: t('projects'), href: "/Projects" },
        { name: t('contact'), href: "/ContactUs" }
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-out ${
                    scrolled 
                        ? "py-4 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-b-2xl" 
                        : "py-8 bg-transparent"
                }`}
            >
                <div className="max-w-[95rem] mx-auto px-6 lg:px-12 flex justify-between items-center">
                    {/* Logo */}
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

                    {/* Right Side Actions */}
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

            {/* REFERENCE STYLE FULL-SCREEN MENU */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-[105] bg-white dark:bg-[#050505] overflow-y-auto"
                    >
                        {/* Background Decorative Accent */}
                        <div className="absolute top-0 right-0 w-[40vw] h-full bg-gray-50 dark:bg-white/[0.01] -z-10" />

                        <div className="min-h-full max-w-[95rem] mx-auto px-6 lg:px-12 flex flex-col justify-start pt-32 lg:pt-44 pb-16 relative">
                            {/* Back Button for Sections */}
                            {lastScrollY > 100 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    onClick={handleBack}
                                    className="absolute top-20 sm:top-24 left-6 lg:left-12 flex items-center gap-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-5 py-2 rounded-full text-gray-900 dark:text-white group z-[120] hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl backdrop-blur-md"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[#1F2BF3] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(31,43,243,0.4)]">
                                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                        {openFromSection 
                                            ? t('back_to_home_section', { section: t(openFromSection) })
                                            : isHomePage ? t('back_to_home') : "Back to Home Experience"
                                        }
                                    </span>
                                </motion.button>
                            )}
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
                                
                                {/* Left Side: Navigation Links */}
                                <div className="lg:col-span-7 flex flex-col">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-12 lg:mb-20">Navigation</h4>
                                    <div className="space-y-4 lg:space-y-8">
                                        {navItems.map((item, i) => (
                                            <motion.div
                                                key={item.name}
                                                custom={i}
                                                variants={itemVariants}
                                                className="overflow-hidden group"
                                            >
                                                {isHomePage && item.href === '/' ? (
                                                    <button 
                                                        onClick={handleBack}
                                                        className="flex items-center gap-6 text-5xl lg:text-[8rem] font-black uppercase tracking-tighter leading-none transition-all duration-500 relative w-full text-left"
                                                    >
                                                        <span className="hidden lg:block text-sm font-black text-gray-200 dark:text-white/10 tracking-widest group-hover:text-[#1F2BF3] transition-colors duration-500">/0{i+1}</span>
                                                        <span className="relative">
                                                            <span className="text-gray-900 dark:text-white transition-opacity duration-500 group-hover:opacity-0 block">
                                                                {item.name}
                                                            </span>
                                                            <span className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-[length:200%_auto] bg-clip-text text-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-gradient-x block whitespace-nowrap">
                                                                {item.name}
                                                            </span>
                                                        </span>
                                                        <ArrowRight className="w-12 h-12 lg:w-24 lg:h-24 opacity-0 -translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#1F2BF3] dark:text-[#00D8C0]" />
                                                    </button>
                                                ) : (
                                                    <Link 
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center gap-6 text-5xl lg:text-[8rem] font-black uppercase tracking-tighter leading-none transition-all duration-500 relative"
                                                    >
                                                        <span className="hidden lg:block text-sm font-black text-gray-200 dark:text-white/10 tracking-widest group-hover:text-[#1F2BF3] transition-colors duration-500">/0{i+1}</span>
                                                        <span className="relative">
                                                            <span className="text-gray-900 dark:text-white transition-opacity duration-500 group-hover:opacity-0 block">
                                                                {item.name}
                                                            </span>
                                                            <span className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-[length:200%_auto] bg-clip-text text-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-gradient-x block whitespace-nowrap">
                                                                {item.name}
                                                            </span>
                                                        </span>
                                                        <ArrowRight className="w-12 h-12 lg:w-24 lg:h-24 opacity-0 -translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#1F2BF3] dark:text-[#00D8C0]" />
                                                    </Link>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side: Contact & Info (The Reference Look) */}
                                <div className="lg:col-span-5 flex flex-col lg:pl-20 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-10 lg:pt-0">
                                    <motion.div variants={infoVariants} className="space-y-20">
                                        {/* Contact Section */}
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-8">Get In Touch</h4>
                                            <a href="mailto:contact@techweb.ma" className="text-2xl lg:text-4xl font-black text-gray-900 dark:text-white hover:text-[#1F2BF3] transition-colors block mb-4 underline decoration-[#1F2BF3] decoration-4 underline-offset-8">
                                                contact@techweb.ma
                                            </a>
                                            <p className="text-xl text-gray-500 font-medium">Tangier, Morocco • +212 607 060 769</p>
                                        </div>

                                        {/* Services / Client Section as requested */}
                                        <div className="grid grid-cols-2 gap-10">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-6">Services</h4>
                                                <ul className="space-y-3">
                                                    {["Web Design", "Development", "Marketing", "Branding"].map((s, i) => (
                                                        <li key={i} className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-6">Socials</h4>
                                                <div className="flex gap-4">
                                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-[#1F2BF3] hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
                                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-[#1F2BF3] hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-[#1F2BF3] hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Start Project CTA in Menu */}
                                        <Link
                                            href="/ContactUs"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-gray-900 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <span className="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-300">
                                                Start A Project <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </span>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar Info */}
                        <div className="absolute bottom-10 left-0 w-full px-6 lg:px-12 flex justify-between items-center opacity-30">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">© 2026 TECHWEB STUDIO</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">SCROLL TO TOP</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    animation: gradient-x 10s ease infinite;
                }
            `}} />
        </>
    );
}
