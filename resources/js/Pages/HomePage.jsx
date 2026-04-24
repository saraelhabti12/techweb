import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
    ArrowRight,
    Mail,
    Phone,
    MapPin,
    Play,
    Plus
} from "lucide-react";

const ClientMarquee = () => {
    const clients = ["STRIPE", "VERCEL", "ADOBE", "META", "GOOGLE", "AMAZON", "APPLE"];
    return (
        <div className="relative py-20 overflow-hidden border-y border-gray-200 dark:border-white/5 bg-white dark:bg-[#050505]">
            <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-20 whitespace-nowrap px-10"
            >
                {[...clients, ...clients, ...clients].map((client, i) => (
                    <span key={i} className="text-4xl lg:text-7xl font-black text-gray-200 dark:text-white/5 hover:text-[#1F2BF3] transition-colors cursor-default uppercase tracking-tighter italic">
                        {client}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const ServiceItem = ({ title, description, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group relative border-b border-gray-200 dark:border-white/10 py-12 lg:py-20 cursor-pointer overflow-hidden"
        >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-6 lg:px-0">
                <div className="flex items-start gap-8 lg:gap-16">
                    <span className="text-xl font-black text-[#1F2BF3] dark:text-[#00D8C0]">0{index + 1}</span>
                    <h3 className="text-4xl lg:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none transition-transform duration-700 group-hover:translate-x-4">
                        {title}
                    </h3>
                </div>
                <div className="max-w-md lg:text-right">
                    <p className="text-lg lg:text-xl text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-500">
                        {description}
                    </p>
                </div>
                <motion.div 
                    animate={{ rotate: isHovered ? 45 : 0 }}
                    className="hidden lg:flex shrink-0 w-20 h-20 rounded-full border border-gray-200 dark:border-white/20 items-center justify-center group-hover:bg-[#1F2BF3] group-hover:border-[#1F2BF3] transition-all duration-500"
                >
                    <Plus className="w-8 h-8 text-gray-900 dark:text-white group-hover:text-white" />
                </motion.div>
            </div>
            
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ clipPath: "inset(100% 0 0 0)" }}
                        animate={{ clipPath: "inset(0% 0 0 0)" }}
                        exit={{ clipPath: "inset(100% 0 0 0)" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 bg-[#1F2BF3]/5 dark:bg-[#00D8C0]/5 -z-0"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function HomePage({ blogs = [], templates = [] }) {
    const { data, setData, post, processing, reset } = useForm({
        full_name: '', email: '', services: [], message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const features = [
        { title: "Fast Launch", description: "Get your digital presence up and running with our optimized deployment workflows." },
        { title: "High Performance", description: "Blazing fast load times and seamless user experiences across all devices." },
        { title: "Secure by Design", description: "Enterprise-grade security protocols to protect your brand and customer data." },
        { title: "Data Driven", description: "Advanced analytics and insights to measure growth and optimize performance." },
        { title: "Scalable Solutions", description: "Architecture that grows with your business, from startup to enterprise." },
        { title: "Modern UI/UX", description: "Cutting-edge design trends that captivate and convert your target audience." }
    ];

    const roadmap = [
        { step: "01", title: "Discovery", description: "Deep dive into your brand, goals, and target audience." },
        { step: "02", title: "Strategy", description: "Crafting a tailored digital roadmap for your success." },
        { step: "03", title: "Design", description: "High-fidelity prototypes with focus on UX and aesthetics." },
        { step: "04", title: "Development", description: "Building with the latest tech stack for performance." },
        { step: "05", title: "Launch", description: "Seamless deployment and initial performance tracking." }
    ];

    return (
        <MainLayout>
            <Head title="TechWeb | Premium Digital Agency" />

            <div className="relative w-full bg-white dark:bg-[#050505] transition-colors duration-700 overflow-hidden font-sans">
                
                {/* 1. HERO SECTION (Simple & Centered Reference Style) */}
                <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">
                    <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
                        
                        {/* Elegant Pill Tag */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-10 px-6 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] dark:text-[#00D8C0]">Aesthetic • Logic • Result</span>
                        </motion.div>
                        
                        {/* Massive Centered Title */}
                        <div className="flex flex-col items-center">
                            <div className="overflow-hidden">
                                <motion.h1 
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                    className="text-[clamp(3.5rem,14vw,14rem)] font-black leading-[0.8] tracking-tighter text-gray-900 dark:text-white uppercase"
                                >
                                    DIGITAL
                                </motion.h1>
                            </div>
                            <div className="overflow-hidden -mt-2 lg:-mt-4">
                                <motion.h1 
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                    className="text-[clamp(3.5rem,14vw,14rem)] font-black leading-[0.8] tracking-tighter text-transparent uppercase"
                                    style={{ WebkitTextStroke: "1px currentColor" }}
                                >
                                    EXCELLENCE
                                </motion.h1>
                            </div>
                        </div>

                        {/* Centered Description */}
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="mt-12 text-lg lg:text-3xl text-gray-500 dark:text-gray-400 max-w-3xl font-medium tracking-tight leading-relaxed"
                        >
                            We blend artistic intuition with technical precision to build immersive digital experiences that redefine your brand's future.
                        </motion.p>

                        {/* Centered Action Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mt-16 flex flex-col sm:flex-row items-center gap-8"
                        >
                            <Link 
                                href="/ContactUs" 
                                className="group relative flex items-center justify-center px-12 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-black uppercase tracking-widest text-xs overflow-hidden transition-transform hover:scale-105 active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Start Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-[#1F2BF3] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </Link>
                            
                            <Link 
                                href="/Projects" 
                                className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white group"
                            >
                                <span className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-white/5 transition-all duration-500">
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                </span>
                                Explore Work
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Simple Aesthetic Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 blur-[120px] rounded-full" />
                    </div>
                </section>

                {/* 2. CLIENT MARQUEE */}
                <ClientMarquee />

                {/* 3. SERVICES SECTION */}
                <section className="relative py-32 lg:py-60 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-[90rem] mx-auto text-center mb-24 lg:mb-40">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8"
                        >
                            Expertise • Creativity • Logic
                        </motion.div>
                        <h2 className="text-5xl lg:text-[10rem] font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                            OUR SERVICES.
                        </h2>
                    </div>

                    <div className="max-w-[90rem] mx-auto flex flex-col">
                        {features.map((service, i) => (
                            <ServiceItem 
                                key={i} 
                                title={service.title} 
                                description={service.description} 
                                index={i} 
                            />
                        ))}
                    </div>
                </section>

                {/* 4. PROCESS SECTION */}
                <section className="relative py-48 bg-gray-50 dark:bg-[#020202] px-6 sm:px-12 lg:px-24">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                            <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
                                <h2 className="text-4xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight mb-8">
                                    THE<br/>PROCESS.
                                </h2>
                                <p className="text-xl text-gray-500 font-medium">
                                    Predictability, speed, and uncompromising quality at every phase of creation.
                                </p>
                            </div>
                            <div className="lg:col-span-8 space-y-40">
                                {roadmap.map((step, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 100 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative"
                                    >
                                        <div className="text-[12rem] lg:text-[20rem] font-black text-gray-200 dark:text-white/5 leading-none absolute -top-20 lg:-top-40 -left-10 lg:-left-20 -z-0 select-none">
                                            {step.step}
                                        </div>
                                        <div className="relative z-10 pl-4 lg:pl-10 border-l-4 border-[#1F2BF3]">
                                            <h4 className="text-3xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase mb-8 tracking-tight">
                                                {step.title}
                                            </h4>
                                            <p className="text-xl lg:text-3xl text-gray-500 leading-relaxed max-w-2xl">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. FINAL CTA */}
                <section className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[#1F2BF3] dark:bg-gray-900" />
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10"
                    >
                        <h2 className="text-6xl lg:text-[15rem] font-black text-white uppercase tracking-tighter leading-none mb-12">
                            LET'S WORK.
                        </h2>
                        <Link href="/ContactUs" className="inline-flex items-center gap-6 px-12 py-6 bg-white text-gray-900 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:scale-110 transition-transform duration-500">
                            Initiate Discovery <ArrowRight className="w-6 h-6" />
                        </Link>
                    </motion.div>
                </section>
            </div>
        </MainLayout>
    );
}
