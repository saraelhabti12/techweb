import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
    ChevronLeft, 
    ChevronRight, 
    Rocket, 
    Zap, 
    Shield, 
    BarChart3, 
    Layers, 
    Monitor, 
    ArrowRight,
    Star,
    CheckCircle2,
    Users,
    Mail,
    Phone,
    MapPin,
    Cpu,
    Globe,
    Code2
} from "lucide-react";

export default function HomePage({ blogs = [], templates = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const slides = [
        {
            id: "01",
            image: "/images/pro1.jpg",
            title: "Professional Website Development",
            subtitle: "Web Development And Design",
            description: "As your digital marketing agency, we build conversion-focused websites combining cutting-edge design with performance-driven functionality."
        },
        {
            id: "02",
            image: "/images/pro2.jpg",
            title: "Creative Design",
            subtitle: "Graphic Design",
            description: "We create impactful and unique visuals to strengthen your brand image. Logos, posters, banners, and more-our creativity transforms your ideas into unforgettable designs."
        },
        {
            id: "03",
            image: "/images/pro1.jpg",
            title: "Online Growth",
            subtitle: "Digital Marketing Services",
            description: "Boost your online visibility with innovative marketing strategies. From social media management to advertising campaigns, we maximize your digital presence."
        }
    ];

    const features = [
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Fast Launch",
            description: "Get your digital presence up and running with our optimized deployment workflows."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "High Performance",
            description: "Blazing fast load times and seamless user experiences across all devices."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure by Design",
            description: "Enterprise-grade security protocols to protect your brand and customer data."
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Data Driven",
            description: "Advanced analytics and insights to measure growth and optimize performance."
        },
        {
            icon: <Layers className="w-6 h-6" />,
            title: "Scalable Solutions",
            description: "Architecture that grows with your business, from startup to enterprise."
        },
        {
            icon: <Monitor className="w-6 h-6" />,
            title: "Modern UI/UX",
            description: "Cutting-edge design trends that captivate and convert your target audience."
        }
    ];

    const team = [
        {
            name: "Anas Menkouch",
            role: "CEO & Founder",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anas"
        },
        {
            name: "Sarah El Amrani",
            role: "Lead Designer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        {
            name: "Mehdi Benkacem",
            role: "Full Stack Developer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi"
        },
        {
            name: "Yasmine Mourad",
            role: "Marketing Strategist",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmine"
        }
    ];

    const roadmap = [
        { step: "01", title: "Discovery", description: "Deep dive into your brand, goals, and target audience.", icon: <Globe className="w-5 h-5" /> },
        { step: "02", title: "Strategy", description: "Crafting a tailored digital roadmap for your success.", icon: <Cpu className="w-5 h-5" /> },
        { step: "03", title: "Design", description: "High-fidelity prototypes with focus on UX and aesthetics.", icon: <Layers className="w-5 h-5" /> },
        { step: "04", title: "Development", description: "Building with the latest tech stack for performance.", icon: <Code2 className="w-5 h-5" /> },
        { step: "05", title: "Launch", description: "Seamless deployment and initial performance tracking.", icon: <Rocket className="w-5 h-5" /> }
    ];

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

    const { data, setData, post, processing, reset, errors } = useForm({
        full_name: '',
        contact_number: '',
        company_name: '',
        email: '',
        services: [],
        message: '',
    });

    const categories = ["All", ...new Set((templates || []).map((t) => t.category))];
    const filteredProjects = selectedCategory === "All" 
        ? (templates || []) 
        : (templates || []).filter((p) => p.category === selectedCategory);

    useEffect(() => {
        const checkTheme = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <MainLayout>
            <Head title="TechWeb | Premium Digital Marketing & Development Agency" />

            <div className="relative w-full bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
                
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/10 blur-[120px] rounded-full dark:opacity-40 opacity-20 animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/10 blur-[120px] rounded-full dark:opacity-30 opacity-15" />
                    <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-[#1F2BF3]/5 blur-[80px] rounded-full dark:opacity-20 opacity-10" />
                </div>

                {/* HERO SECTION */}
                <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Hero Text */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#1F2BF3]/20 bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 text-[#1F2BF3] text-xs font-bold tracking-widest uppercase mb-6">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F2BF3] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1F2BF3]"></span>
                                </span>
                                Future-Ready Agency
                            </div>
                            
                            <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] mb-8 tracking-tight">
                                <span className="block text-gray-900 dark:text-white">Elevating Your</span>
                                <span className="bg-gradient-to-r from-[#1F2BF3] via-[#00D8C0] to-[#1F2BF3] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">Digital DNA.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
                                We craft immersive digital experiences that blend artistic creativity with technological excellence. Scale your vision with TechWeb.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="/ContactUs"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-[#1F2BF3] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(31,43,243,0.3)]"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10 flex items-center">
                                        Start Your Project <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link
                                    href="/Projects"
                                    className="inline-flex items-center justify-center px-8 py-4 font-bold text-gray-900 dark:text-white bg-transparent border-2 border-gray-200 dark:border-gray-800 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-[#1F2BF3]/30"
                                >
                                    View Our Work
                                </Link>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-12 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Trusted By Innovators</div>
                                <div className="h-[1px] w-12 bg-gray-300 dark:bg-gray-800" />
                                <div className="flex items-center gap-4">
                                    <div className="font-black text-xl italic dark:text-white">STRIPE</div>
                                    <div className="font-black text-xl italic dark:text-white">VERCEL</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Interactive Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative z-10 flex justify-center"
                        >
                            <div className="relative group">
                                {/* Glass Container */}
                                <div className="w-[320px] sm:w-[450px] aspect-[4/5] rounded-[3rem] p-8 glass-morphism border border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                                    {/* Abstract Shapes inside glass */}
                                    <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-[#1F2BF3]/20 rounded-full blur-3xl animate-pulse" />
                                    <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-[#00D8C0]/20 rounded-full blur-3xl" />
                                    
                                    {/* Stats Widget */}
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20">
                                                <Zap className="w-6 h-6 text-[#00D8C0]" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Active Projects</div>
                                                <div className="text-3xl font-black text-gray-900 dark:text-white">78+</div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white/10 dark:bg-black/20 rounded-[2rem] border border-white/20 backdrop-blur-md">
                                            <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4">Performance Metrics</div>
                                            <div className="space-y-4">
                                                {[
                                                    { label: "UX Fidelity", val: 98 },
                                                    { label: "Optimization", val: 94 },
                                                    { label: "Security", val: 100 }
                                                ].map((stat, i) => (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-[11px] font-bold dark:text-white mb-1.5">
                                                            <span>{stat.label}</span>
                                                            <span>{stat.val}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${stat.val}%` }}
                                                                transition={{ duration: 2, delay: 1 }}
                                                                className="h-full bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-full" 
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#1F2BF3] to-[#1F2BF3]/80 rounded-2xl text-white shadow-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black uppercase tracking-tighter opacity-70">Team Velocity</div>
                                                    <div className="text-sm font-bold tracking-tight">Accelerating Growth</div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 opacity-70" />
                                        </div>
                                    </div>

                                    {/* System Status Indicator */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Systems Online</span>
                                    </div>
                                </div>

                                {/* Floating Elements behind glass */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#1F2BF3] rounded-3xl opacity-20 blur-2xl -z-10 animate-bounce-slow" />
                                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#00D8C0] rounded-full opacity-20 blur-2xl -z-10 animate-pulse" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FEATURE CARDS SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Capabilities</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">Engineered for Excellence.</h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                                We combine technical prowess with creative intuition to deliver high-impact digital solutions that resonate.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-[#1F2BF3]/30"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Zap className="w-12 h-12" />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3] mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4">{feature.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        Learn More <ArrowRight className="ml-2 w-3 h-3" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SYSTEM OVERVIEW / VALUE SECTION */}
                <section className="relative py-32 bg-gray-50/50 dark:bg-[#080808] px-6 sm:px-12 lg:px-24 overflow-hidden">
                    {/* Background Noise/Grid */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900 group">
                                <img src="/images/service1.jpg" alt="Agency Overview" className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {/* Floating decorative cards */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] rounded-3xl -z-10 blur-2xl opacity-20 animate-pulse" />
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-12 -left-12 p-6 glass-morphism rounded-3xl border border-white/20 shadow-xl hidden lg:block z-20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500 rounded-2xl">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quality Score</div>
                                        <div className="text-xl font-black text-gray-900 dark:text-white">99.8%</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3]">Why TechWeb</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                                Transcending Traditional Digital Boundaries.
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed text-justify">
                                We don't just build websites; we engineer digital ecosystems. Our approach integrates market intelligence with avant-garde aesthetics to ensure your brand stands out in a saturated market.
                            </p>
                            
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    "Hyper-Personalized Strategy",
                                    "Agile Implementation",
                                    "Conversion-First Design",
                                    "Continuous Optimization",
                                    "Real-time Performance Monitoring",
                                    "24/7 Premium Technical Support"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                <Link
                                    href="/AboutUs"
                                    className="group inline-flex items-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                                >
                                    The Full Story <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TEAM SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Architects of Change</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">Meet the Visionaries.</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6 bg-gray-100 dark:bg-[#111]">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2BF3]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-[#1F2BF3] transition-colors"><Globe className="w-4 h-4" /></div>
                                                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-[#1F2BF3] transition-colors"><Zap className="w-4 h-4" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">{member.name}</h4>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#1F2BF3]">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ROADMAP / PROCESS SECTION */}
                <section className="relative py-32 bg-gray-50/50 dark:bg-[#080808] px-6 sm:px-12 lg:px-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Our Method</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">The Innovation Cycle.</h3>
                        </div>

                        <div className="relative">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 dark:bg-gray-800 -translate-y-1/2 hidden lg:block" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10">
                                {roadmap.map((step, i) => (
                                    <div key={i} className="flex flex-col items-center lg:items-start group">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-[#1F2BF3] mb-8 relative z-20 transition-all duration-300 group-hover:bg-[#1F2BF3] group-hover:text-white group-hover:scale-110">
                                            {step.icon}
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] text-white flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-[#080808]">
                                                {step.step}
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">{step.title}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed text-center lg:text-left">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT SECTION */}
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
                                        { icon: <MapPin className="w-6 h-6" />, label: "Visit Studios", val: "Casablanca, Morocco" }
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

                {/* TESTIMONIALS SLIDER SECTION */}
                <section className="relative py-32 px-6 bg-gray-50/50 dark:bg-[#080808]">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-1 mb-10">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#00D8C0] text-[#00D8C0]" />)}
                        </div>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={testimonialIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                className="mb-12"
                            >
                                <blockquote className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-relaxed mb-10">
                                    “{testimonials[testimonialIndex].quote}”
                                </blockquote>
                                <div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">{testimonials[testimonialIndex].author}</div>
                                    <div className="text-sm font-bold uppercase tracking-widest text-[#1F2BF3]">{testimonials[testimonialIndex].role}</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => setTestimonialIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                                className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#1F2BF3] hover:border-[#1F2BF3] hover:text-white transition-all group"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => setTestimonialIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                                className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#1F2BF3] hover:border-[#1F2BF3] hover:text-white transition-all group"
                            >
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* LATEST BLOGS SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Insights</h2>
                                <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">Fresh Perspectives.</h3>
                            </div>
                            <Link href="/blogs" className="group flex items-center gap-2 font-black uppercase text-xs tracking-widest text-gray-900 dark:text-white border-b-2 border-[#1F2BF3] pb-2 hover:brightness-110 transition-all">
                                See All Intelligence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {blogs.slice(0, 3).map((blog, i) => (
                                <Link
                                    key={i}
                                    href={`/blogs/${blog.id}`}
                                    className="group relative flex flex-col"
                                >
                                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 bg-gray-100 dark:bg-[#111]">
                                        <img 
                                            src={blog.images?.[0] || "/images/pro1.jpg"} 
                                            alt={blog.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {blog.category || "General"}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">5 min read • By TechWeb</div>
                                        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-[#1F2BF3] transition-colors line-clamp-2">
                                            {blog.title}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                                            {blog.excerpt || "Explore the latest trends and insights in digital marketing and web development..."}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white group-hover:gap-4 transition-all">
                                            Read More <ArrowRight className="w-4 h-4 text-[#1F2BF3]" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA BANNER SECTION */}
                <section className="relative py-24 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative overflow-hidden rounded-[4rem] bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] p-12 lg:p-24 shadow-2xl">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                                <Zap className="w-96 h-96 -translate-y-20 translate-x-20 rotate-12" />
                            </div>
                            
                            <div className="relative z-10 max-w-3xl">
                                <h3 className="text-4xl lg:text-7xl font-black text-white mb-10 leading-tight">
                                    Let's Build the Future Together.
                                </h3>
                                <div className="flex flex-wrap gap-6">
                                    <Link
                                        href="/ContactUs"
                                        className="px-10 py-5 bg-white text-[#1F2BF3] rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Initiate Discovery
                                    </Link>
                                    <Link
                                        href="/AboutUs"
                                        className="px-10 py-5 bg-black/10 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black/20 transition-all backdrop-blur-md"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Custom Styles for Redesign */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    animation: gradient-x 5s ease infinite;
                }
                .glass-morphism {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(40px);
                }
                .dark .glass-morphism {
                    background: rgba(0, 0, 0, 0.3);
                }
                .animate-bounce-slow {
                    animation: bounce 6s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
                }
            `}} />
        </MainLayout>
    );
}
