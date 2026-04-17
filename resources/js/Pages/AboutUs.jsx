import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
    Star, 
    ChevronLeft, 
    ChevronRight, 
    Target, 
    Eye, 
    Heart, 
    Zap, 
    ArrowRight,
    CheckCircle2,
    Users,
    Trophy,
    Briefcase
} from "lucide-react";

export default function About() {
    const images = [
        "/images/project2.jpg",
        "/images/weare2.jpg",
        "/images/weare2.jpg",
        "/images/project2.jpg",
        "/images/project2.jpg",
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);
    const [index, setIndex] = useState(0);

    const testimonials = [
        {
            rating: 5,
            quote: "TechWeb a transformé notre présence en ligne avec un site moderne et performant. L'équipe est professionnelle et réactive.",
            author: "Ahmed BenKacem",
            role: "Marketing Manager"
        },
        {
            rating: 5,
            quote: "Grâce à leur expertise en SEO, notre trafic a considérablement augmenté. Des résultats concrets et une collaboration efficace !",
            author: "Sofia El Amrani",
            role: "SEO Expert"
        },
        {
            rating: 4,
            quote: "Un service impeccable et un support technique toujours disponible. TechWeb est un partenaire de confiance.",
            author: "Yassine Mourad",
            role: "Business Owner"
        }
    ];

    const stats = [
        { label: "Years Experience", val: "67", icon: <Briefcase className="w-6 h-6" /> },
        { label: "Projects Done", val: "90", icon: <Zap className="w-6 h-6" /> },
        { label: "Happy Clients", val: "200", icon: <Users className="w-6 h-6" /> },
        { label: "Awards Won", val: "60", icon: <Trophy className="w-6 h-6" /> }
    ];

    const { data, setData, post, processing, reset, errors } = useForm({
        full_name: '',
        contact_number: '',
        company_name: '',
        email: '',
        services: [],
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    return (
        <MainLayout>
            <Head title="About Us | TechWeb Innovation & Design" />

            <div className="relative w-full bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
                
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/10 blur-[120px] rounded-full dark:opacity-40 opacity-20 animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/10 blur-[120px] rounded-full dark:opacity-30 opacity-15" />
                </div>

                {/* HERO / MISSION SECTION */}
                <section className="relative pt-32 pb-16 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative order-2 lg:order-1"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900 group aspect-[4/5] lg:aspect-auto">
                                <img src="/images/bgwelcome3.jpg" alt="Our Mission" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2BF3]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {/* Floating decorative card */}
                            <div className="absolute -bottom-10 -right-10 p-8 glass-morphism rounded-[2.5rem] border border-white/20 shadow-2xl hidden md:block z-20 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Focused on</div>
                                        <div className="text-xl font-black text-gray-900 dark:text-white">Pure Excellence</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#1F2BF3]/20 bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 text-[#1F2BF3] text-xs font-bold tracking-widest uppercase mb-6">
                                The Story Behind TechWeb
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8">
                                <span className="text-gray-900 dark:text-white">Better Design For Your</span>
                                <span className="block bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-clip-text text-transparent">Digital Future.</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-justify">
                                With over 6 years of expertise in the digital landscape, TechWeb has been at the forefront of delivering exceptional marketing and development solutions. Our seasoned team leverages cutting-edge technology and proven strategies to help businesses thrive in an ever-evolving digital world.
                            </p>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-white/5">
                                <img src="/images/fav1.png" alt="CEO" className="w-14 h-14 rounded-xl object-cover" />
                                <div>
                                    <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider"> Abdessalam Elamrani</div>
                                    <div className="text-xs font-bold text-[#1F2BF3] uppercase tracking-widest">CEO & Founder</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SHOWCASE SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-gray-50/50 dark:bg-[#080808] overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1F2BF3]/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Portfolio Highlights</h2>
                            <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Showcase of Excellence.</h3>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] mx-auto rounded-full" />
                        </motion.div>

                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            {/* Left Side: Info and Controls */}
                            <div className="w-full lg:w-1/3 order-2 lg:order-1">
                                <div className="space-y-8">
                                    <div className="hidden lg:block">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.5 }}
                                                className="space-y-4"
                                            >
                                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#1F2BF3]/10 text-[#1F2BF3] text-[10px] font-black uppercase tracking-widest">
                                                    Featured Project {activeIndex + 1}
                                                </span>
                                                <h4 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                                                    {activeIndex === 0 && "Digital Innovation"}
                                                    {activeIndex === 1 && "Creative Strategy"}
                                                    {activeIndex === 2 && "Future Tech"}
                                                    {activeIndex === 3 && "Brand Identity"}
                                                    {activeIndex === 4 && "Global Reach"}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Explore how we combine technical expertise with creative vision to deliver outstanding digital experiences.
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Pagination / Progress Indicators */}
                                    <div className="flex lg:flex-col gap-6">
                                        {images.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => swiperRef.current?.slideToLoop(i)}
                                                className="group relative flex items-center gap-6"
                                            >
                                                <span className={`text-xs font-black font-mono transition-colors duration-300 ${
                                                    activeIndex === i ? "text-[#1F2BF3]" : "text-gray-400"
                                                }`}>
                                                    {(i + 1).toString().padStart(2, '0')}
                                                </span>
                                                <div className="relative h-px flex-1 min-w-[60px] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                                    <motion.div 
                                                        className="absolute inset-0 bg-[#1F2BF3]"
                                                        initial={false}
                                                        animate={{ 
                                                            x: activeIndex === i ? "0%" : "-100%",
                                                            opacity: activeIndex === i ? 1 : 0 
                                                        }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                                {activeIndex === i && (
                                                    <motion.span 
                                                        layoutId="activeIndicator"
                                                        className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-[#1F2BF3]"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button 
                                            onClick={() => swiperRef.current?.slidePrev()}
                                            className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-900 dark:text-white shadow-xl hover:bg-[#1F2BF3] hover:text-white transition-all group"
                                        >
                                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                                        </button>
                                        <button 
                                            onClick={() => swiperRef.current?.slideNext()}
                                            className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-900 dark:text-white shadow-xl hover:bg-[#1F2BF3] hover:text-white transition-all group"
                                        >
                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Main Slider */}
                            <div className="w-full lg:w-2/3 order-1 lg:order-2">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 rounded-[4rem]" />
                                    
                                    <Swiper
                                        modules={[Autoplay, EffectCreative]}
                                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                                        loop={true}
                                        speed={1200}
                                        grabCursor={true}
                                        effect="creative"
                                        creativeEffect={{
                                            prev: { translate: ["-10%", 0, -200], rotate: [0, 0, -5], opacity: 0 },
                                            next: { translate: ["120%", 0, 0], opacity: 1 },
                                        }}
                                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                        className="rounded-[3rem] lg:rounded-[4rem] shadow-2xl border-4 border-white dark:border-gray-900 overflow-hidden aspect-[4/3] lg:aspect-[16/10]"
                                    >
                                        {images.map((src, i) => (
                                            <SwiperSlide key={i} className="overflow-hidden">
                                                <motion.div 
                                                    className="w-full h-full relative"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 1.5 }}
                                                >
                                                    <img 
                                                        src={src} 
                                                        alt={`Slide ${i + 1}`} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    
                                                    {/* Floating Label on Image */}
                                                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                                        <div className="glass-morphism px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-xl">
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Interactive Case</div>
                                                            <div className="text-xl font-black text-white">View Details</div>
                                                        </div>
                                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#1F2BF3] shadow-2xl">
                                                            <ArrowRight className="w-6 h-6" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE US / STATS SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Performance Metrics</h2>
                                <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">Fueling Your Revenue Growth.</h3>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                                Discover our showcase of featured works where creativity meets expertise. Each project highlights our commitment to excellence and our ability to deliver results tailored to your specific needs.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-8">
                                {stats.map((stat, i) => (
                                    <div key={i} className="group p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all hover:border-[#1F2BF3]/30">
                                        <div className="text-[#1F2BF3] mb-4 transition-transform group-hover:scale-110">{stat.icon}</div>
                                        <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">{stat.val}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900">
                                <img src="/images/bgwelcome3.jpg" alt="Impact" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#1F2BF3]/20 to-transparent" />
                            </div>
                            {/* Decorative background circle */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#00D8C0]/10 blur-3xl rounded-full -z-10" />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#1F2BF3]/10 blur-3xl rounded-full -z-10" />
                        </div>
                    </div>
                </section>

                {/* REVIEWS SECTION */}
                <section className="relative py-32 px-6 bg-gray-50/50 dark:bg-[#080808]">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-10">Client Testimonials</div>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                className="mb-12"
                            >
                                <div className="flex justify-center mb-8 gap-1">
                                    {[...Array(testimonials[index].rating)].map((_, i) => (
                                        <Star key={i} className="w-6 h-6 fill-[#1F2BF3] text-[#1F2BF3]" />
                                    ))}
                                </div>
                                <blockquote className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-relaxed mb-10 italic">
                                    “{testimonials[index].quote}”
                                </blockquote>
                                <div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">{testimonials[index].author}</div>
                                    <div className="text-sm font-bold uppercase tracking-widest text-[#1F2BF3]">{testimonials[index].role}</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => setIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                                className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#1F2BF3] hover:border-[#1F2BF3] hover:text-white transition-all group"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => setIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                                className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#1F2BF3] hover:border-[#1F2BF3] hover:text-white transition-all group"
                            >
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* CONTACT FORM SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="flex flex-col gap-10">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Get In Touch</h2>
                                <h3 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-8">Connect Your Brand to Growth.</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
                                    Join our satisfied clients and leverage our digital transformation expertise to elevate your business to new heights.
                                </p>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Strategic Consultation</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Tailored Digital Roadmaps</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-[3rem] blur-3xl opacity-10" />
                            <div className="relative glass-morphism rounded-[3rem] p-10 border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-2xl bg-white/40 dark:bg-black/40">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.full_name}
                                                onChange={(e) => setData('full_name', e.target.value)}
                                                className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Message</label>
                                        <textarea
                                            rows="4"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none resize-none"
                                            placeholder="Describe your project..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-5 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Sending...' : 'Transmit Inquiry'}
                                    </button>
                                </form>
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
