import React, { useState } from "react";
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Projects() {
    const { templates = [] } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", ...new Set(templates.map(t => t.category))];
    const filteredProjects = selectedCategory === "All"
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    return (
        <MainLayout>
            <Head title="Projects" />

            <section className="py-24 bg-gray-100 dark:bg-gray-900">
            <div className="text-center mb-10">
                <h2 className="text-7xl font-bold mb-6 text-gray-900 dark:text-white" 
                    style={{
                    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: "1.5"
                }}>
                    Our Projects
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Discover a compilation of our most remarkable projects
                </p>
            </div>
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => (
                <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 shadow-md shadow-[#1F2BF3]/40
                    ${
                    selectedCategory === cat
                        ? "bg-[#1F2BF3] text-white scale-110" // bouton actif : couleur unique + plus grand
                        : "bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white hover:brightness-110 hover:scale-95"
                    }`}
                >
                {cat}
                </button>
            ))}
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {filteredProjects.map((project) => (
                        <div
                        key={project.id}
                        className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden w-[350px] h-[580px] mx-auto group"
                        >
                        <div className="w-full h-[75%] overflow-hidden relative">
                            <img
                            src={project.image}
                            alt={project.title}
                            className="
                                absolute top-0 left-0 w-full h-auto
                                transition-transform duration-[1500ms] ease-in-out
                                group-hover:-translate-y-[calc(100%-360px)]
                            "
                            />
                </div>
                <div className="p-4 text-center">
                    <h3
                    className="text-xl font-bold bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-clip-text text-transparent mb-2"
                    >
                    {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                    {project.description}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </section>

            <section className="py-20 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Do You Have A Project in Mind ?
                </p>
                <div className="mx-auto h-0.5 w-45 rounded" 
                    style={{ background: "linear-gradient(to right, #1F2BF3, #00D8C0)" }}>
                </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 mt-6">
                        Book Your Consultation
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Our experts are ready to analyze your needs and offer tailored solutions to achieve your digital goals.
                    </p>
                    <Link
                        href="/ContactUs"
                        className="inline-block px-12 py-2 text-sm font-medium
                                text-gray-800 dark:text-white
                                bg-white/20 dark:bg-black/10
                                rounded-2xl shadow-md shadow-[#1F2BF3]/20
                                transform transition-all duration-200
                                hover:bg-gradient-to-r hover:from-[#1F2BF3] hover:to-[#00D8C0]
                                hover:brightness-110 hover:scale-95
                                cursor-pointer text-center"
                    >
                        ESTIMATE YOUR PROJECT
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}
