import { Link } from '@inertiajs/react';
import DarkModeToggle from '../DarkModeToggle';
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";


export default function Navbar({ transparent = false }) {
    const [openServices, setOpenServices] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState("up");

    useEffect(() => {
        let lastScroll = window.scrollY;
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll) setScrollDirection("down");
            else setScrollDirection("up");
            lastScroll = currentScroll;
            setScrollY(currentScroll);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinkClass = "relative text-black dark:text-white font-medium after:content-[''] after:block after:h-[4px] after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0] after:transition-transform after:duration-500 hover:after:scale-x-100 hover:after:origin-left";

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
                transparent && scrollY < 50
                    ? "bg-transparent shadow-none"
                    : "bg-white/80 dark:bg-black/80 shadow-sm"
            } ${scrollDirection === "down" ? "py-2" : "py-4"}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <img
                                className="h-12 w-auto block dark:hidden"
                                src="/images/logotechweb.png"
                                alt="TechWeb"
                            />
                            <img
                                className="h-12 w-auto hidden dark:block"
                                src="/images/logo3.png"
                                alt="TechWeb Dark"
                            />
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className={navLinkClass}>Home</Link>
                        <Link href="/AboutUs" className={navLinkClass}>About Us</Link>
                        
                        <div className="relative group">
                            <button
                                onMouseEnter={() => setOpenServices(true)}
                                onClick={() => setOpenServices(!openServices)}
                                className={navLinkClass}
                            >
                                <span className="inline-flex items-center">
                                    Services
                                    <ChevronDownIcon
                                        className={`w-5 h-5 ml-1 transition-transform duration-300 ${
                                            openServices ? "rotate-180" : "rotate-0"
                                        }`}
                                    />
                                </span>
                            </button>

                            {openServices && (
                                <div
                                    onMouseEnter={() => setOpenServices(true)}
                                    onMouseLeave={() => setOpenServices(false)}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-xl border border-gray-100 dark:border-gray-800 z-[60] overflow-hidden"
                                >
                                    <div className="p-6 grid grid-cols-1 gap-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">WEB SOLUTIONS</h3>
                                            <div className="space-y-4">
                                                <Link href="/Services" className="block group/item cursor-pointer">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-600">Website Creation</h4>
                                                    <p className="text-xs text-gray-500">Custom-made, high-performance websites.</p>
                                                </Link>
                                                <Link href="/Services" className="block group/item cursor-pointer">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-600">E-commerce</h4>
                                                    <p className="text-xs text-gray-500">Online stores optimized for sales.</p>
                                                </Link>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">MARKETING</h3>
                                            <div className="space-y-4">
                                                <Link href="/Services" className="block group/item cursor-pointer">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-600">SEO Referencing</h4>
                                                    <p className="text-xs text-gray-500">Improve your search engine ranking.</p>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <Link href="/Services" className="text-blue-600 font-semibold text-sm hover:underline">View all services →</Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/Projects" className={navLinkClass}>Projects</Link>
                        <Link href="/ContactUs" className={navLinkClass}>Contact Us</Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/ContactUs"
                            className="hidden lg:block px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-xl shadow-lg hover:brightness-110 transition-all active:scale-95"
                        >
                            ESTIMATE PROJECT
                        </Link>
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                        >
                            Sign In
                        </Link>
                        <DarkModeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}