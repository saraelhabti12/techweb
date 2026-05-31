import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from "framer-motion";
import { 
    Code2, 
    ShoppingCart, 
    Search, 
    Palette, 
    Megaphone, 
    ArrowRight, 
    CheckCircle2,
    Zap,
    Layers,
    Globe,
    Cpu,
    Monitor
} from "lucide-react";

export default function Services() {
    const services = [
        {
            title: "Web Development",
            description: "We build modern, scalable websites using the latest technologies. Our focus is on performance, accessibility, and high-fidelity user experiences.",
            features: ["Custom Architecture", "Responsive Design", "API Integration", "Performance Audit"],
            icon: <Code2 className="w-8 h-8" />,
            image: "/images/pro1.jpg",
            color: "#1F2BF3"
        },
        {
            title: "E-commerce Solutions",
            description: "Launch powerful online stores that convert. We handle everything from secure payment gateways to intuitive product management systems.",
            features: ["Secure Payments", "Inventory Management", "Conversion Optimization", "User Accounts"],
            icon: <ShoppingCart className="w-8 h-8" />,
            image: "/images/pro2.jpg",
            color: "#00D8C0"
        },
        {
            title: "SEO & Digital Marketing",
            description: "Boost your visibility and reach your target audience effectively. Our data-driven strategies ensure sustainable growth and high ROI.",
            features: ["Keyword Research", "Technical SEO", "Content Strategy", "Campaign Analytics"],
            icon: <Search className="w-8 h-8" />,
            image: "/images/pro1.jpg",
            color: "#1F2BF3"
        },
        {
            title: "Graphic Design & Branding",
            description: "Creative visuals that resonate with your brand identity. We craft logos, brand guidelines, and marketing materials that stand out.",
            features: ["Logo Design", "Brand Identity", "UI/UX Design", "Print Materials"],
            icon: <Palette className="w-8 h-8" />,
            image: "/images/pro2.jpg",
            color: "#00D8C0"
        },
        {
            title: "Advertising Campaigns",
            description: "Reach your audience through targeted ad campaigns across multiple platforms. We optimize for results and measurable impact.",
            features: ["Social Media Ads", "Google Ads", "Retargeting", "Ad Creative"],
            icon: <Megaphone className="w-8 h-8" />,
            image: "/images/pro1.jpg",
            color: "#1F2BF3"
        }
    ];

    const processes = [
        { title: "Discovery", icon: <Globe className="w-5 h-5" />, desc: "Analyzing your market and objectives." },
        { title: "Strategy", icon: <Cpu className="w-5 h-5" />, desc: "Defining the technical roadmap." },
        { title: "Design", icon: <Palette className="w-5 h-5" />, desc: "High-end UI/UX prototyping." },
        { title: "Build", icon: <Layers className="w-5 h-5" />, desc: "Precise engineering and testing." }
    ];

    return (
        <MainLayout>
            <Head title="Our Services | Premium Digital Solutions" />

            <div className="relative w-full bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
                
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/10 blur-[80px] rounded-full dark:opacity-40 opacity-20 animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/10 blur-[80px] rounded-full dark:opacity-30 opacity-15" />
                </div>

                {/* HERO SECTION */}
                <section className="relative pt-40 pb-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-6">Our Capabilities</h2>
                            <h1 className="text-5xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
                                Specialized <span className="bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-clip-text text-transparent">Solutions.</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                We combine artistic vision with engineering precision to deliver digital experiences that captivate and convert.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* SERVICES DETAILED LIST */}
                <section className="relative py-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto space-y-32">
                        {services.map((service, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}
                            >
                                <div className="w-full lg:w-1/2">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 aspect-[4/3]">
                                            <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                                                <div className="w-16 h-16 rounded-2xl glass-morphism border border-white/20 flex items-center justify-center text-white">
                                                    {service.icon}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-1/2 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">{service.title}</h3>
                                    </div>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                                        {service.description}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-[#00D8C0]" />
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6">
                                        <Link
                                            href="/ContactUs"
                                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold transition-all hover:scale-105"
                                        >
                                            Inquire About {service.title} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* PROCESS SECTION */}
                <section className="relative py-32 bg-gray-50/50 dark:bg-[#080808] px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Our Method</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">The Engineering Cycle.</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {processes.map((proc, i) => (
                                <div key={i} className="group p-8 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 shadow-xl transition-all hover:shadow-2xl hover:border-[#1F2BF3]/30">
                                    <div className="w-14 h-14 rounded-2xl bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3] mb-6 group-hover:scale-110 transition-transform">
                                        {proc.icon}
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4">{proc.title}</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        {proc.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative glass-morphism rounded-[3rem] p-12 lg:p-20 text-center border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white shadow-xl">
                                <Zap className="w-10 h-10" />
                            </div>
                            <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">Ready to Accelerate?</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                                Let's discuss your project and see how our specialized digital solutions can drive your brand's growth.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link
                                    href="/ContactUs"
                                    className="px-10 py-5 bg-[#1F2BF3] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="/Projects"
                                    className="px-10 py-5 bg-transparent border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                                >
                                    View Portfolio
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
