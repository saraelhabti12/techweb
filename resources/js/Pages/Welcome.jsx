import React, { useState, useEffect } from "react";
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from '@/Components/HeroSection';
import ProjectRequestForm from '@/Components/ProjectRequestForm';
import SectionWithBackground from '@/Components/Shared/SectionWithBackground';
import { useTranslation } from 'react-i18next';
import { 
    Zap,
    Shield,
    BarChart3,
    Rocket,
    CheckCircle2,
    Mail,
    Phone,
    MapPin,
    Plus,
    Layers,
    Globe,
    Code2,
    Cpu,
    UserIcon
} from "lucide-react";

const ClientMarquee = () => {
    const clients = ["WEB SITES", "DESIGN", "EDIT", "PHOTOGRAPH", "STUDIO", "DIGITAL"];
    return (
        <div className="relative py-24 overflow-hidden bg-white dark:bg-[#050505]">
            <SectionWithBackground variant="default" className="absolute inset-0" />
            <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex gap-24 whitespace-nowrap px-12 relative z-10 will-change-transform"
            >
                {[...clients, ...clients, ...clients].map((client, i) => (
                    <span key={i} className="text-4xl lg:text-8xl font-black text-gray-200 dark:text-white/5 hover:text-[#1F2BF3] transition-colors cursor-default uppercase tracking-tighter italic">
                        {client}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

export default function Welcome({ blogs = [], templates = [], creators = [], team = [] }) {
    const { t } = useTranslation();
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    // Scroll restoration logic
    useEffect(() => {
        const shouldRestore = sessionStorage.getItem('shouldRestoreScroll');
        const lastScroll = sessionStorage.getItem('lastHomeScroll');
        
        if (shouldRestore === 'true' && lastScroll) {
            sessionStorage.removeItem('shouldRestoreScroll');
            // Small delay to ensure content is rendered
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(lastScroll),
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, []);

    const features = [
        { icon: <Rocket className="w-6 h-6" />, title: t('fast_launch'), description: t('fast_launch_desc') },
        { icon: <Zap className="w-6 h-6" />, title: t('high_performance'), description: t('high_performance_desc') },
        { icon: <Shield className="w-6 h-6" />, title: t('secure_design'), description: t('secure_design_desc') },
        { icon: <BarChart3 className="w-6 h-6" />, title: t('data_driven'), description: t('data_driven_desc') },
        { icon: <Layers className="w-6 h-6" />, title: t('scalable_solutions'), description: t('scalable_solutions_desc') },
        { icon: <Plus className="w-6 h-6" />, title: t('modern_ui_ux'), description: t('modern_ui_ux_desc') }
    ];

    const roadmap = [
        { step: "01", title: t('step_discovery'), description: t('step_discovery_desc'), icon: <Globe /> },
        { step: "02", title: t('step_strategy'), description: t('step_strategy_desc'), icon: <Cpu /> },
        { step: "03", title: t('step_design'), description: t('step_design_desc'), icon: <Layers /> },
        { step: "04", title: t('step_development'), description: t('step_development_desc'), icon: <Code2 /> },
        { step: "05", title: t('step_launch'), description: t('step_launch_desc'), icon: <Rocket /> }
    ];

    const testimonials = [
        { quote: t('testimonial_1'), author: "Ahmed BenKacem", role: t('testimonial_role_1') },
        { quote: t('testimonial_2'), author: "Sofia El Amrani", role: t('testimonial_role_2') },
        { quote: t('testimonial_3'), author: "Yassine Mourad", role: t('testimonial_role_3') }
    ];

    return (
        <MainLayout showParticles={false}>
            <Head title={`TechWeb | ${t('premium_digital_agency', { defaultValue: 'Premium Digital Agency' })}`} />

            <div className="relative w-full transition-colors duration-700 overflow-hidden">
                {/* 1. HERO SECTION */}
                <SectionWithBackground variant="default">
                    <HeroSection 
                        title={t('hero_title')}
                        subtitle={t('hero_subtitle')}
                        ctaText={t('hero_cta')}
                    />
                </SectionWithBackground>

                {/* 2. CLIENT MARQUEE */}
                <ClientMarquee />

                {/* 3. FEATURES SECTION (Compact & Refined) */}
                <SectionWithBackground id="services" variant="projects" className="py-24 px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Section Header */}
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-20">
                            <div className="max-w-xl">
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 mb-4"
                                >
                                    <div className="w-8 h-[1px] bg-[#1F2BF3]" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#1F2BF3]">{t('our_capabilities')}</span>
                                </motion.div>
                                <motion.h2 
                                    initial={{ opacity: 0, y: 30 }} 
                                    whileInView={{ opacity: 1, y: 0 }} 
                                    className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.95] mb-2"
                                >
                                    {t('engineering_frontiers').split(' ').slice(0, -1).join(' ')} <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]">{t('engineering_frontiers').split(' ').slice(-1)}</span>
                                </motion.h2>
                            </div>
                            <motion.p 
                                initial={{ opacity: 0 }} 
                                whileInView={{ opacity: 1 }} 
                                className="text-base text-gray-500 dark:text-gray-400 max-w-xs font-medium leading-relaxed italic border-l-2 border-[#00D8C0] pl-5"
                            >
                                {t('capabilities_desc')}
                            </motion.p>
                        </div>

                        {/* Staggered Feature Grid - Centered & Tight */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ 
                                        y: i % 2 === 1 ? 14 : -10,
                                        scale: 1.03,
                                        transition: { duration: 0.3, ease: "easeOut" }
                                    }}
                                    className={`group relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-[#1F2BF3]/30 transition-all duration-700 shadow-sm hover:shadow-[0_20px_50px_rgba(31,43,243,0.08)] backdrop-blur-md overflow-hidden ${
                                        i % 2 === 1 ? 'lg:translate-y-6' : ''
                                    }`}
                                >
                                    {/* Abstract Background Decoration */}
                                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#1F2BF3]/5 rounded-full blur-2xl group-hover:bg-[#1F2BF3]/10 transition-colors duration-700" />
                                    
                                    {/* Icon Container (Compact) */}
                                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        {React.cloneElement(feature.icon, { size: 24, strokeWidth: 2 })}
                                    </div>

                                    {/* Text Content */}
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-3 tracking-tight flex items-center gap-2">
                                            {feature.title}
                                            <div className="w-1 h-1 rounded-full bg-[#00D8C0] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-500">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Hover "Scanner" Line */}
                                    <motion.div 
                                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1F2BF3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </SectionWithBackground>

                {/* 4. VALUE SECTION (System Overview) */}
                <SectionWithBackground id="about" variant="projects" className="py-48 px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.92, y: 30 }} 
                            whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                            viewport={{ once: true }}
                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                            className="relative group/about-img"
                        >
                            <div className="rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 [perspective:1000px]">
                                <motion.img 
                                    src="/images/service1.jpg" 
                                    alt="Agency" 
                                    className="w-full h-auto object-cover" 
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                            </div>
                            
                            {/* Floating shield badge with continuous physics loop */}
                            <motion.div 
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -bottom-10 -right-10 p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 z-20 group"
                            >
                                <Shield className="w-12 h-12 text-[#1F2BF3] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                                <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">99.8%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('quality_index', { defaultValue: 'Quality Index' })}</div>
                            </motion.div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8 block">{t('elite_standards')}</span>
                            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-12">{t('beyond_boundless')}</h2>
                            <p className="text-xl text-gray-500 mb-12 leading-relaxed font-medium">{t('beyond_boundless_desc')}</p>
                            
                            {/* Staggered checklist items */}
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[t('personalized_strategy'), t('agile_implementation'), t('conversion_first'), t('premium_support_247')].map((item, i) => (
                                    <motion.li 
                                        key={i} 
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                                        whileHover={{ x: 6, transition: { duration: 0.2 } }}
                                        className="flex items-center gap-4 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs cursor-default"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-[#1F2BF3] flex-shrink-0" /> {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </SectionWithBackground>

                {/* 5. TEAM SECTION */}
                {team.length > 0 && (
                    <SectionWithBackground variant="projects" className="py-48 px-6 sm:px-12 lg:px-24 overflow-hidden">
                        <div className="max-w-[90rem] mx-auto relative z-10">
                            <div className="flex flex-col items-center text-center mb-32">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8">{t('visionaries')}</span>
                                <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{t('meet_masterminds')}</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                                {team.map((member, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 30 }} 
                                        whileInView={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: i * 0.1 }}
                                        className="group"
                                    >
                                        <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-8 bg-gray-100 dark:bg-white/5 grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <img 
                                                src={member.avatar ? `/storage/${member.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} 
                                                alt={member.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{member.name}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{member.job_title || member.role}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </SectionWithBackground>
                )}

                {/* 6. ROADMAP SECTION (Redesigned - Compact Version) */}
                <SectionWithBackground id="projects" variant="projects" className="py-32 text-gray-900 dark:text-white px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-[90rem] mx-auto relative z-10">
                        {/* Header with refined typography */}
                        <div className="text-center mb-24">
                            <motion.span 
                                initial={{ opacity: 0, tracking: '0.1em' }}
                                whileInView={{ opacity: 1, tracking: '0.4em' }}
                                className="text-[10px] font-black uppercase text-[#1F2BF3] mb-6 block"
                            >
                                {t('methodology', { defaultValue: 'Our Methodology' })}
                            </motion.span>
                            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-6 italic leading-none">
                                {t('innovation_workflow').split(' ').slice(0, -1).join(' ')}<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]">{t('innovation_workflow').split(' ').slice(-1)}</span>.
                            </h2>
                            <p className="text-gray-500 dark:text-white/40 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                                {t('workflow_desc')}
                            </p>
                        </div>

                        {/* Timeline / Roadmap Steps */}
                        <div className="relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden lg:block absolute top-[50px] left-0 w-full h-[2px] bg-gray-200 dark:bg-white/10">
                                <motion.div 
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#1F2BF3] to-transparent opacity-50"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {roadmap.map((step, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 30 }} 
                                        whileInView={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: i * 0.1, duration: 0.6 }}
                                        viewport={{ once: true }}
                                        className="group relative"
                                    >
                                        {/* Step Number Bubble (Smaller) */}
                                        <div className="relative z-20 mb-8 flex justify-center lg:justify-start">
                                            <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-black/40 backdrop-blur-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-3xl font-black transition-all duration-500 group-hover:scale-110 group-hover:bg-[#1F2BF3] group-hover:border-[#1F2BF3] group-hover:shadow-[0_0_40px_rgba(31,43,243,0.3)] group-hover:text-white">
                                                <span className="group-hover:hidden transition-all">{step.step}</span>
                                                <div className="hidden group-hover:block transition-all text-white scale-110">
                                                    {React.cloneElement(step.icon, { size: 28, strokeWidth: 2.5 })}
                                                </div>
                                            </div>
                                        </div>

                                         {/* Step Content Card (More Compact) */}
                                        <motion.div 
                                            whileHover={{ y: -10, scale: 1.02 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="p-6 rounded-[2.5rem] bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-100 dark:border-white/10 transition-all duration-500 group-hover:bg-white dark:group-hover:bg-white/[0.08] group-hover:border-[#1F2BF3]/30 h-full shadow-sm hover:shadow-xl cursor-default"
                                        >
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="w-6 h-1 bg-[#1F2BF3] rounded-full group-hover:w-12 transition-all duration-500" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-[#1F2BF3]">Phase {step.step}</span>
                                            </div>
                                            <h4 className="text-xl font-black uppercase mb-4 tracking-tight group-hover:text-[#1F2BF3] transition-colors">{step.title}</h4>
                                            <p className="text-gray-500 dark:text-white/50 text-base leading-relaxed font-medium group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors">
                                                {step.description}
                                            </p>
                                        </motion.div>
                                        
                                        {/* Background Pulse (Desktop only) */}
                                        <div className="hidden lg:block absolute top-[50px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1F2BF3] rounded-full blur-md animate-ping opacity-10 group-hover:opacity-100" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionWithBackground>

                {/* 7. TESTIMONIALS SECTION */}
                <SectionWithBackground variant="orbs" className="relative py-48 px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-[70rem] mx-auto text-center relative z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-gray-100 dark:text-white/5 -z-10 select-none opacity-50">"</div>
                        <AnimatePresence mode="wait">
                            <motion.div key={testimonialIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.5 }}>
                                <blockquote className="text-3xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase leading-[1.1] tracking-tighter mb-16">
                                    {testimonials[testimonialIndex].quote}
                                </blockquote>
                                <div className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{testimonials[testimonialIndex].author}</div>
                                <div className="text-sm font-black uppercase tracking-[0.2em] text-[#1F2BF3] mt-2">{testimonials[testimonialIndex].role}</div>
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex justify-center gap-6 mt-16">
                            {testimonials.map((_, i) => (
                                <button key={i} onClick={() => setTestimonialIndex(i)} className={`w-3 h-3 rounded-full transition-all ${testimonialIndex === i ? 'bg-[#1F2BF3] w-12' : 'bg-gray-200 dark:bg-white/10'}`} />
                            ))}
                        </div>
                    </div>
                </SectionWithBackground>

                {/* Creators Section */}
                {creators.length > 0 && (
                    <SectionWithBackground variant="projects" className="relative py-48 px-6 sm:px-12 lg:px-24 overflow-hidden">
                        <div className="max-w-[90rem] mx-auto relative z-10">
                            <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
                                <div className="max-w-2xl">
                                    <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8 block">{t('talent_portfolio')}</motion.span>
                                    <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                                        {t('professional_creators').split('.').slice(0, -1).join('.')}. <span className="text-[#1F2BF3]">{t('creators')}</span>
                                    </motion.h2>
                                </div>
                                <Link href={route('creators.index')} className="text-sm font-black uppercase tracking-[0.2em] text-[#1F2BF3] border-b-2 border-[#1F2BF3] pb-2">{t('view_all_talent')}</Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                                {creators.slice(0, 4).map((creator, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 30 }} 
                                        whileInView={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: i * 0.1 }}
                                        className="group"
                                    >
                                        <Link href={route('creators.show', creator.id)}>
                                            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-8 bg-gray-100 dark:bg-white/5 shadow-2xl transition-transform duration-700 group-hover:-translate-y-4">
                                                {creator.profile_photo ? (
                                                    <img src={`/storage/${creator.profile_photo}`} alt={creator.display_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <UserIcon className="w-20 h-20" />
                                                    </div>
                                                )}
                                                <div className="absolute top-6 left-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
                                                        creator.availability_status === 'available' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'
                                                    }`}>
                                                        {t(creator.availability_status, { defaultValue: creator.availability_status.replace('_', ' ') })}
                                                    </span>
                                                </div>
                                            </div>
                                            <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-[#1F2BF3] transition-colors">{creator.display_name}</h4>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <MapPin className="w-3 h-3" />
                                                {creator.city}
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </SectionWithBackground>
                )}

                {/* 8. BLOG SECTION */}
                <SectionWithBackground variant="orbs" className="relative py-48 px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-[90rem] mx-auto relative z-10">
                        <div className="flex justify-between items-end mb-24">
                            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t('insights')}</h2>
                            <Link href="/blogs" className="text-sm font-black uppercase tracking-[0.2em] text-[#1F2BF3] border-b-2 border-[#1F2BF3] pb-2">{t('view_all')}</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {blogs.slice(0, 3).map((blog, i) => (
                                <Link key={i} href={`/blogs/${blog.id}`} className="group">
                                    <div className="aspect-[4/3] rounded-[3rem] overflow-hidden mb-10 bg-gray-200">
                                        <img src={blog.images?.[0] || "/images/pro1.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 group-hover:text-[#1F2BF3] transition-colors line-clamp-2">{blog.title}</h4>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>{t('min_read')}</span>
                                        <span className="w-6 h-[1px] bg-gray-400" />
                                        <span>{t('studio_insight')}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </SectionWithBackground>


                {/* 9. CONTACT SECTION */}
                <SectionWithBackground variant="projects" className="relative py-32 px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            
                            {/* Contact Text */}
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-10"
                            >
                                <div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">{t('connect_with_us')}</h2>
                                    <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">{t('ready_evolution')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
                                        {t('contact_desc')}
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { icon: <Mail className="w-6 h-6" />, label: t('email_us'), val: "contact@techweb.ma" },
                                        { icon: <Phone className="w-6 h-6" />, label: t('call_experts'), val: "+212 607 060 769" },
                                        { icon: <MapPin className="w-6 h-6" />, label: t('visit_studios'), val: "Tangier, Morocco" }
                                    ].map((info, i) => (
                                        <div key={i} className="flex items-center gap-6 group">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-[#1F2BF3] transition-colors group-hover:bg-[#1F2BF3] group-hover:text-white">
                                                {info.icon}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">{info.label}</div>
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">{info.val}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                                <div className="relative glass-morphism rounded-[3rem] p-10 border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-2xl bg-white/40 dark:bg-black/40">
                                    <ProjectRequestForm creators={creators} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </SectionWithBackground>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    animation: gradient-x 10s ease infinite;
                }
            `}} />
        </MainLayout>
    );
}
