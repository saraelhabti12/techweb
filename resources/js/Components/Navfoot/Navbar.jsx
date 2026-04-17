import { Link } from '@inertiajs/react';
import DarkModeToggle from '../DarkModeToggle';
import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ServicesMegaMenu from '@/Components/ServicesMegaMenu';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ transparent = false }) {
    const [openServices, setOpenServices] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState("up");
    const menuRef = useRef(null);

    useEffect(() => {
        let lastScroll = window.scrollY;
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll > 100) setScrollDirection("down");
            else setScrollDirection("up");
            lastScroll = currentScroll;
            setScrollY(currentScroll);
        };
        window.addEventListener("scroll", handleScroll);
        
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenServices(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLinkClass = "relative text-gray-700 dark:text-gray-200 font-bold text-sm tracking-tight hover:text-[#1F2BF3] dark:hover:text-[#00D8C0] transition-colors py-2 group";
    
    const activeIndicator = "absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] transition-all duration-300 group-hover:w-full";

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
                transparent && scrollY < 50
                    ? "bg-transparent py-6"
                    : "bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl shadow-lg py-4"
            } ${scrollDirection === "down" ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex justify-between items-center h-12">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 group">
                            <img
                                className="h-10 w-auto block dark:hidden transition-transform duration-500 group-hover:scale-110"
                                src="/images/logotechweb.png"
                                alt="TechWeb"
                            />
                            <img
                                className="h-10 w-auto hidden dark:block transition-transform duration-500 group-hover:scale-110"
                                src="/images/logo3.png"
                                alt="TechWeb Dark"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-10 items-center">
                        <Link href="/" className={navLinkClass}>
                            Home
                            <span className={activeIndicator} />
                        </Link>
                        <Link href="/AboutUs" className={navLinkClass}>
                            About Us
                            <span className={activeIndicator} />
                        </Link>
                        
                        <div 
                            className="static" 
                            ref={menuRef}
                            onMouseEnter={() => setOpenServices(true)}
                            onMouseLeave={() => setOpenServices(false)}
                        >
                            <button
                                onClick={() => setOpenServices(!openServices)}
                                className={`${navLinkClass} flex items-center gap-1.5`}
                            >
                                Services
                                <ChevronDownIcon
                                    className={`w-4 h-4 transition-transform duration-500 ${
                                        openServices ? "rotate-180 text-[#1F2BF3] dark:text-[#00D8C0]" : "rotate-0"
                                    }`}
                                />
                                <span className={activeIndicator} />
                            </button>

                            <ServicesMegaMenu 
                                isOpen={openServices} 
                                onClose={() => setOpenServices(false)} 
                            />
                        </div>

                        <Link href="/Projects" className={navLinkClass}>
                            Projects
                            <span className={activeIndicator} />
                        </Link>
                        <Link href="/ContactUs" className={navLinkClass}>
                            Contact Us
                            <span className={activeIndicator} />
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-3">
                            <Link
                                href="/ContactUs"
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-xl shadow-[0_10px_20px_rgba(31,43,243,0.3)] hover:shadow-[0_15px_25px_rgba(31,43,243,0.4)] hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                Start Project
                            </Link>
                        </div>
                        
                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />
                        
                        <Link
                            href={route('login')}
                            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#1F2BF3] dark:hover:text-[#00D8C0] transition-colors"
                        >
                            Sign In
                        </Link>

                        <DarkModeToggle />

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-[#080808] border-t border-gray-100 dark:border-white/5 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-6">
                            <Link href="/" className="block text-lg font-bold text-gray-900 dark:text-white">Home</Link>
                            <Link href="/AboutUs" className="block text-lg font-bold text-gray-900 dark:text-white">About Us</Link>
                            
                            <div className="space-y-4">
                                <button 
                                    onClick={() => setOpenServices(!openServices)}
                                    className="flex items-center justify-between w-full text-lg font-bold text-gray-900 dark:text-white"
                                >
                                    Services
                                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${openServices ? 'rotate-180' : ''}`} />
                                </button>
                                {openServices && (
                                    <div className="pl-4 space-y-3 border-l-2 border-[#1F2BF3]/20">
                                        <Link href="/Services" className="block text-sm text-gray-600 dark:text-gray-400">Web Solutions</Link>
                                        <Link href="/Services" className="block text-sm text-gray-600 dark:text-gray-400">Marketing Solutions</Link>
                                        <Link href="/Services" className="block text-sm text-gray-600 dark:text-gray-400">Visual Solutions</Link>
                                    </div>
                                )}
                            </div>

                            <Link href="/Projects" className="block text-lg font-bold text-gray-900 dark:text-white">Projects</Link>
                            <Link href="/ContactUs" className="block text-lg font-bold text-gray-900 dark:text-white">Contact Us</Link>
                            
                            <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                <Link
                                    href="/ContactUs"
                                    className="w-full py-4 flex items-center justify-center text-sm font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-2xl shadow-lg"
                                >
                                    Start Project
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
