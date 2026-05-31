import React, { useState } from "react";
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Layers, Globe, Filter } from "lucide-react";
import PremiumBackground from "@/Components/UI/PremiumBackground";

export default function Projects() {
    const { templates = [] } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", ...new Set(templates.map(t => t.category))];
    const filteredProjects = selectedCategory === "All"
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    return (
        <MainLayout showParticles={false}>
            <Head title="Our Projects | TechWeb Portfolio" />

            <div className="relative w-full bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
                
                <PremiumBackground variant="projects" />

                {/* HERO SECTION */}
                <section className="relative pt-40 pb-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-6">Our Portfolio</h2>
                            <h1 className="text-5xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
                                Remarkable <span className="bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-clip-text text-transparent">Creations.</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                Explore our compilation of high-impact digital products designed to elevate brands and engage audiences.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* FILTER & GRID SECTION */}
                <section className="relative py-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-4 mb-20">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 border-2 ${
                                        selectedCategory === cat
                                            ? "bg-[#1F2BF3] border-[#1F2BF3] text-white shadow-[0_10px_20px_rgba(31,43,243,0.3)] scale-105"
                                            : "bg-transparent border-gray-100 dark:border-white/5 text-gray-500 hover:border-[#1F2BF3]/30 hover:text-[#1F2BF3]"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Project Grid */}
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProjects.map((project) => (
                                    <motion.div
                                        layout
                                        key={project.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="group relative"
                                    >
                                        <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-[#1F2BF3]/30">
                                            {/* Image with hover scroll effect */}
                                            <div className="w-full h-full overflow-hidden relative">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="absolute top-0 left-0 w-full h-auto transition-transform duration-[2000ms] ease-in-out group-hover:-translate-y-[calc(100%-480px)]"
                                                />
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                                    <div className="w-full">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#00D8C0] mb-2">{project.category}</div>
                                                        <h3 className="text-2xl font-black text-white mb-4">{project.title}</h3>
                                                        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                                                            Project Details <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* External labels for mobile/accessibility */}
                                        <div className="mt-6 px-4">
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors mb-2">{project.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>

                {/* CONSULTATION CTA */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative glass-morphism rounded-[3rem] p-12 lg:p-20 text-center border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-2xl bg-white/40 dark:bg-black/40 overflow-hidden">
                            {/* Decorative blur */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1F2BF3]/20 blur-3xl rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#00D8C0]/20 blur-3xl rounded-full" />
                            
                            <div className="relative z-10">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8">Ready to Scale?</h2>
                                <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">Book Your Consultation.</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                                    Our experts are ready to analyze your needs and offer tailored solutions to achieve your digital goals.
                                </p>
                                <Link
                                    href="/ContactUs"
                                    className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                                >
                                    Estimate Your Project <ArrowRight className="ml-3 w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .glass-morphism {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(40px);
                }
                .dark .glass-morphism {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}} />
        </MainLayout>
    );
}
