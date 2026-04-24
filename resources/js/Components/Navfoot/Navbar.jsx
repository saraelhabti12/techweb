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

export default function Navbar() {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        
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
    }, [isMenuOpen]);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark(!isDark);
    };

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
        { name: "Home", href: "/" },
        { name: "About", href: "/AboutUs" },
        { name: "Services", href: "/Services" },
        { name: "Projects", href: "/Projects" },
        { name: "Contact", href: "/ContactUs" }
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
                    scrollY > 50 ? "py-4" : "py-8"
                }`}
            >
                <div className="max-w-[95rem] mx-auto px-6 lg:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="relative z-[110] group">
                        <img className="h-8 w-auto block dark:hidden transition-transform duration-500 group-hover:scale-110" src="/images/logotechweb.png" alt="TechWeb" />
                        <img className="h-8 w-auto hidden dark:block transition-transform duration-500 group-hover:scale-110" src="/images/logo3.png" alt="TechWeb" />
                    </Link>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-8 relative z-[110]">
                        <button onClick={toggleDarkMode} className="text-gray-900 dark:text-white hover:text-[#1F2BF3] transition-colors">
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        <Link href={auth?.user ? route('dashboard') : route('login')} className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:border-[#1F2BF3] hover:text-[#1F2BF3] transition-all group">
                            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Link>

                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="group flex items-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full overflow-hidden transition-transform active:scale-95"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10 pl-2">
                                {isMenuOpen ? "CLOSE" : "MENU"}
                            </span>
                            <div className="flex flex-col gap-1.5 relative z-10 w-6">
                                <motion.div animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 4 : 0 }} className="w-full h-[1.5px] bg-current" />
                                <motion.div animate={{ opacity: isMenuOpen ? 0 : 1 }} className="w-full h-[1.5px] bg-current" />
                                <motion.div animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -4 : 0 }} className="w-full h-[1.5px] bg-current" />
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
                        className="fixed inset-0 z-[105] bg-white dark:bg-[#050505] overflow-hidden"
                    >
                        {/* Background Decorative Accent */}
                        <div className="absolute top-0 right-0 w-[40vw] h-full bg-gray-50 dark:bg-white/[0.01] -z-10" />

                        <div className="h-full max-w-[95rem] mx-auto px-6 lg:px-12 flex flex-col justify-center pt-20">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
                                
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
                                                <Link 
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-6 text-5xl lg:text-[8rem] font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none transition-colors relative"
                                                >
                                                    <span className="hidden lg:block text-sm font-black text-gray-300 dark:text-gray-800 tracking-widest">/0{i+1}</span>
                                                    <span className="bg-gradient-to-r from-[#1F2BF3] via-white to-[#00D8C0] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                                                        {item.name}
                                                    </span>
                                                    <ArrowRight className="w-12 h-12 lg:w-24 lg:h-24 opacity-0 -translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#1F2BF3] dark:text-[#00D8C0]" />
                                                </Link>
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
                                            <p className="text-xl text-gray-500 font-medium">Tangier, Morocco • +212 600 000 000</p>
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
