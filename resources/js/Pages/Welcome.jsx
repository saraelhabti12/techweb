import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import HeroSection from '@/Components/HeroSection';
import { 
    ArrowRight,
    Zap,
    Shield,
    BarChart3,
    Rocket,
    CheckCircle2,
    Star,
    ChevronLeft,
    ChevronRight,
    Play,
    Mail,
    Phone,
    MapPin,
    Plus,
    Layers,
    Globe,
    Code2,
    Cpu
} from "lucide-react";

const ClientMarquee = () => {
    const clients = ["STRIPE", "SARA", "ADOBE", "META", "GOOGLE", "AMAZON", "APPLE"];
    return (
        <div className="relative py-24 overflow-hidden border-y border-gray-200 dark:border-white/5 bg-white dark:bg-[#050505]">
            <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-24 whitespace-nowrap px-12"
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

export default function Welcome({ blogs = [], templates = [] }) {
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const { data, setData, post, processing, reset } = useForm({
        full_name: '', contact_number: '', company_name: '', email: '', services: [], message: '',
    });

    const features = [
        { icon: <Rocket className="w-6 h-6" />, title: "Fast Launch", description: "Get your digital presence up and running with our optimized deployment workflows." },
        { icon: <Zap className="w-6 h-6" />, title: "High Performance", description: "Blazing fast load times and seamless user experiences across all devices." },
        { icon: <Shield className="w-6 h-6" />, title: "Secure by Design", description: "Enterprise-grade security protocols to protect your brand and customer data." },
        { icon: <BarChart3 className="w-6 h-6" />, title: "Data Driven", description: "Advanced analytics and insights to measure growth and optimize performance." },
        { icon: <Layers className="w-6 h-6" />, title: "Scalable Solutions", description: "Architecture that grows with your business, from startup to enterprise." },
        { icon: <Plus className="w-6 h-6" />, title: "Modern UI/UX", description: "Cutting-edge design trends that captivate and convert your target audience." }
    ];

    const team = [
        { name: "Abdessalam Elamrani", role: "CEO & Founder", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anas" },
        { name: "Sara ElHabti", role: "Full stuck Developer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        { name: "Mohamed Elafia", role: "Photographer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi" },
        { name: "Salah ", role: "Editor", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmine" },
    ];

    const roadmap = [
        { step: "01", title: "Discovery", description: "Deep dive into your brand, goals, and target audience.", icon: <Globe /> },
        { step: "02", title: "Strategy", description: "Crafting a tailored digital roadmap for your success.", icon: <Cpu /> },
        { step: "03", title: "Design", description: "High-fidelity prototypes with focus on UX and aesthetics.", icon: <Layers /> },
        { step: "04", title: "Development", description: "Building with the latest tech stack for performance.", icon: <Code2 /> },
        { step: "05", title: "Launch", description: "Seamless deployment and initial performance tracking.", icon: <Rocket /> }
    ];

    const testimonials = [
        { quote: "TechWeb a transformé notre présence en ligne avec un site moderne et performant.", author: "Ahmed BenKacem", role: "Marketing Manager" },
        { quote: "Grâce à leur expertise en SEO, notre trafic a considérablement augmenté.", author: "Sofia El Amrani", role: "SEO Expert" },
        { quote: "Un service impeccable et un support technique toujours disponible.", author: "Yassine Mourad", role: "Business Owner" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    return (
        <MainLayout>
            <Head title="TechWeb | Premium Digital Agency" />

            <div className="relative w-full bg-white dark:bg-[#050505] transition-colors duration-700 overflow-hidden">
                
                {/* 1. HERO SECTION */}
                <HeroSection 
                    title="Crafting Digital Masterpieces"
                    subtitle="We blend artistic intuition with technical precision to build immersive digital experiences that redefine your brand's future."
                    ctaText="Start Your Journey"
                />

                {/* 2. CLIENT MARQUEE */}
                <ClientMarquee />

                {/* 3. FEATURES SECTION (Rich Details) */}
                <section className="relative py-40 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
                            <div className="max-w-2xl">
                                <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8 block">Our Capabilities</motion.span>
                                <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                                    Engineering The Frontiers.
                                </motion.h2>
                            </div>
                            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-xl text-gray-500 max-w-sm font-medium">
                                We combine avant-garde design with robust engineering to deliver unparalleled digital impact.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {features.map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-12 rounded-[3rem] bg-gray-50 dark:bg-white/[0.02] border border-transparent hover:border-[#1F2BF3]/20 dark:hover:border-[#00D8C0]/20 hover:bg-white dark:hover:bg-white/[0.04] transition-all duration-500 shadow-sm hover:shadow-2xl"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#1F2BF3] text-white flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase mb-6 tracking-tight group-hover:text-[#1F2BF3] transition-colors">{feature.title}</h4>
                                    <p className="text-gray-500 text-lg leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. VALUE SECTION (System Overview) */}
                <section className="relative py-48 bg-gray-50 dark:bg-[#020202] px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="relative">
                            <div className="rounded-[4rem] overflow-hidden shadow-2xl">
                                <img src="/images/service1.jpg" alt="Agency" className="w-full h-auto" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5">
                                <Shield className="w-12 h-12 text-[#1F2BF3] mb-4" />
                                <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">99.8%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quality Index</div>
                            </div>
                        </motion.div>
                        
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8 block">Elite Standards</span>
                            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-12">Beyond The Boundless Digital.</h2>
                            <p className="text-xl text-gray-500 mb-12 leading-relaxed font-medium">We specialize in the alchemy of art and technology. Transforming conventional goals into extraordinary digital ecosystems that breathe and grow.</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {["Personalized Strategy", "Agile Implementation", "Conversion-First", "24/7 Premium Support"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs">
                                        <CheckCircle2 className="w-5 h-5 text-[#1F2BF3]" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 5. TEAM SECTION */}
                <section className="relative py-48 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="flex flex-col items-center text-center mb-32">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-8">Visionaries</span>
                            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Meet The Masterminds.</h2>
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
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{member.name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. ROADMAP SECTION */}
                <section className="relative py-48 bg-gray-900 text-white px-6 sm:px-12 lg:px-24">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="text-center mb-32">
                            <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter mb-8 italic">THE INNOVATION<br/>WORKFLOW.</h2>
                            <p className="text-white/40 max-w-2xl mx-auto text-xl font-medium">Predictability, speed, and uncompromising quality at every phase.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                            {roadmap.map((step, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div className="w-20 h-20 rounded-[2rem] bg-white text-gray-900 flex items-center justify-center mb-10 text-3xl font-black shadow-2xl group-hover:bg-[#1F2BF3] transition-colors">
                                        {step.step}
                                    </div>
                                    <h4 className="text-2xl font-black uppercase mb-6">{step.title}</h4>
                                    <p className="text-white/50 text-lg leading-relaxed">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. TESTIMONIALS SECTION */}
                <section className="relative py-48 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-[70rem] mx-auto text-center relative">
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
                </section>

                {/* 8. BLOG SECTION */}
                <section className="relative py-48 bg-gray-50 dark:bg-[#020202] px-6 sm:px-12 lg:px-24">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="flex justify-between items-end mb-24">
                            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Insights.</h2>
                            <Link href="/blogs" className="text-sm font-black uppercase tracking-[0.2em] text-[#1F2BF3] border-b-2 border-[#1F2BF3] pb-2">See All</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {blogs.slice(0, 3).map((blog, i) => (
                                <Link key={i} href={`/blogs/${blog.id}`} className="group">
                                    <div className="aspect-[4/3] rounded-[3rem] overflow-hidden mb-10 bg-gray-200">
                                        <img src={blog.images?.[0] || "/images/pro1.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 group-hover:text-[#1F2BF3] transition-colors line-clamp-2">{blog.title}</h4>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>5 MIN READ</span>
                                        <span className="w-6 h-[1px] bg-gray-400" />
                                        <span>STUDIO INSIGHT</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 9. CONTACT SECTION (Restored to original style) */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            
                            {/* Contact Text */}
                            <div className="flex flex-col gap-10">
                                <div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Connect With Us</h2>
                                    <h3 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">Ready to Start Your Digital Evolution?</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
                                        Tell us about your project, and let's craft something exceptional together.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { icon: <Mail className="w-6 h-6" />, label: "Email Us", val: "contact@techweb.ma" },
                                        { icon: <Phone className="w-6 h-6" />, label: "Call Experts", val: "+212 600 000 000" },
                                        { icon: <MapPin className="w-6 h-6" />, label: "Visit Studios", val: "Tangier, Morocco" }
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
                            </div>

                            {/* Contact Form */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
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
                                                    placeholder="Enter your name"
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
                                                    placeholder="hello@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Choose Service</label>
                                            <select 
                                                className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none appearance-none"
                                                onChange={(e) => setData('services', [e.target.value])}
                                            >
                                                <option>Website Creation</option>
                                                <option>E-commerce Solutions</option>
                                                <option>Digital Marketing</option>
                                                <option>Brand Design</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Project Brief</label>
                                            <textarea
                                                rows="4"
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none resize-none"
                                                placeholder="Tell us about your project..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-5 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {processing ? 'Transmitting...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
