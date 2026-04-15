import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Globe, Clock } from "lucide-react";

export default function ContactUs() {
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

    const contactInfo = [
        { icon: <Mail className="w-6 h-6" />, label: "Email Support", val: "contact@techweb.ma", desc: "Available 24/7 for inquiries." },
        { icon: <Phone className="w-6 h-6" />, label: "Call Directly", val: "+212 600 000 000", desc: "Mon-Fri from 9am to 6pm." },
        { icon: <MapPin className="w-6 h-6" />, label: "Visit Studios", val: "Tanger, Morocco", desc: "Innovating from the heart of the north." },
        { icon: <Clock className="w-6 h-6" />, label: "Response Time", val: "< 12 Hours", desc: "Our experts respond rapidly." }
    ];

    return (
        <MainLayout>
            <Head title="Contact Us | TechWeb Global Support" />

            <div className="relative w-full bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
                
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/10 blur-[120px] rounded-full dark:opacity-40 opacity-20 animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/10 blur-[120px] rounded-full dark:opacity-30 opacity-15" />
                </div>

                {/* HERO SECTION */}
                <section className="relative pt-40 pb-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-6">Connect With Us</h2>
                            <h1 className="text-5xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
                                Let's Start a <span className="bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-clip-text text-transparent">Conversation.</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                Our experts are ready to analyze your vision and transform it into a digital reality. Reach out today.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* CONTACT CONTENT SECTION */}
                <section className="relative py-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                        
                        {/* Info Column */}
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {contactInfo.map((info, i) => (
                                    <motion.div 
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 transition-all hover:border-[#1F2BF3]/30"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3] mb-6">
                                            {info.icon}
                                        </div>
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">{info.label}</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{info.val}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{info.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] text-white shadow-2xl relative overflow-hidden group">
                                <Globe className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 group-hover:scale-110 transition-transform duration-[2s]" />
                                <h3 className="text-3xl font-black mb-6 relative z-10">Global Innovation Studio</h3>
                                <p className="text-white/80 leading-relaxed mb-8 relative z-10 text-justify">
                                    We work with forward-thinking companies worldwide, bridging the gap between artistic vision and technological excellence from our hub in Morocco.
                                </p>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="flex -space-x-3">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 bg-gray-800 overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="Expert" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-widest">Connect with 12+ experts</div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-[3rem] blur-3xl opacity-10" />
                            <div className="relative glass-morphism rounded-[3rem] p-8 lg:p-12 border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-2xl bg-white/40 dark:bg-black/40">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Direct Inquiry</h3>
                                </div>

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
                                            <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Contact Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={data.contact_number}
                                                onChange={(e) => setData('contact_number', e.target.value)}
                                                className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                                                placeholder="+212 600 000 000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Company Name</label>
                                            <input
                                                type="text"
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                                                placeholder="Your Company"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Choose Services</label>
                                        <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                                            {["Website Creation","E-commerce","Photography","SEO & Marketing","Graphic Design","Advertising"].map((service) => (
                                                <label key={service} className="flex items-center gap-2 cursor-pointer group/label">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.services.includes(service)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setData('services', [...data.services, service]);
                                                            } else {
                                                                setData('services', data.services.filter(s => s !== service));
                                                            }
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#1F2BF3] focus:ring-[#1F2BF3] bg-white dark:bg-gray-800"
                                                    />
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover/label:text-[#1F2BF3] transition-colors">{service}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2">Project Message</label>
                                        <textarea
                                            rows="4"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none resize-none"
                                            placeholder="Describe your project or goals..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-5 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <Send className="w-5 h-5" />
                                        {processing ? 'Transmitting...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MAP SECTION */}
                <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-gray-50/50 dark:bg-[#080808]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#1F2BF3] mb-4">Location</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">Our Tanger Studio.</h3>
                        </div>

                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-900 aspect-[21/9] min-h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.123456789!2d-5.815!3d35.779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0f8f0d1234567%3A0x123456789abcdef!2sTanger%2C%20Morocco!5e0!3m2!1sfr!2sma!4v1695657850000!5m2!1sfr!2sma"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5" />
                        </div>

                        <div className="flex justify-center mt-12">
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=Tangier+Morocco"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-10 py-5 glass-morphism border border-white/20 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white dark:hover:bg-white hover:text-[#1F2BF3] transition-all"
                            >
                                Get Directions <MapPin className="w-5 h-5 group-hover:animate-bounce" />
                            </a>
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
