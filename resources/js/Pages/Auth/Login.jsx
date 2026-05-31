import React, { useState, useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, 
    Lock, 
    ArrowRight, 
    Zap, 
    ShieldCheck, 
    LayoutDashboard,
    Eye,
    EyeOff,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 font-sans">
            <Head title={`Agency Login | TechWeb`} />

            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/10 blur-[120px] rounded-full dark:opacity-40 opacity-20 animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/10 blur-[120px] rounded-full dark:opacity-30 opacity-15" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-[#1F2BF3]/5 blur-[80px] rounded-full dark:opacity-20 opacity-10" />
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Left Side: Brand & Visuals */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex flex-col justify-center space-y-12"
                >
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <ApplicationLogo className="h-12 w-auto group-hover:scale-110 transition-transform duration-300" />
                        </Link>
                        
                        <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight" dangerouslySetInnerHTML={{ __html: t('access_digital_studio') }}>
                        </h1>
                        
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-md leading-relaxed">
                            {t('unified_environment_desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-md">
                        <FeatureItem icon={<ShieldCheck />} label={t('secure_access')} />
                        <FeatureItem icon={<UnifiedIcon />} label={t('unified_hub')} />
                        <FeatureItem icon={<Zap />} label={t('realtime_updates')} />
                        <FeatureItem icon={<Clock />} label={t('smart_attendance')} />
                    </div>

                    {/* Clock/Status Widget */}
                    <div className="inline-flex items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-gray-100 dark:border-gray-800 self-start shadow-xl">
                        <div className="w-10 h-10 rounded-xl bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('current_system_time')}</div>
                            <div className="text-lg font-black text-gray-900 dark:text-white leading-none">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center"
                >
                    <div className="w-full max-w-[480px]">
                        <div className="relative group">
                            {/* Glassmorphism Card */}
                            <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-2xl p-10 lg:p-12 rounded-[3.5rem] border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden">
                                
                                {/* Top Branding (Mobile only) */}
                                <div className="lg:hidden flex flex-col items-center mb-10 text-center">
                                    <ApplicationLogo className="h-16 w-auto mb-4" />
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t('sign_in')}</h2>
                                </div>

                                <div className="hidden lg:block mb-10">
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('welcome_back_title', { defaultValue: 'Welcome Back' })}</h2>
                                    <p className="text-gray-500 font-bold mt-1 uppercase text-[10px] tracking-widest">{t('sign_in_continue')}</p>
                                </div>

                                {status && (
                                    <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{t('email_address')}</label>
                                        <div className="relative group/field">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-[#1F2BF3] transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                autoComplete="username"
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder={t('enter_email')}
                                                className="w-full bg-gray-50/50 dark:bg-black/20 border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1F2BF3] focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-2 text-xs font-bold text-red-500 ml-1" />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pr-1">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{t('password')}</label>
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-[10px] font-black text-[#1F2BF3] hover:underline uppercase tracking-widest"
                                                >
                                                    {t('forgot_password_q')}
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative group/field">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-[#1F2BF3] transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-gray-50/50 dark:bg-black/20 border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1F2BF3] focus:border-transparent transition-all outline-none"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-2 text-xs font-bold text-red-500 ml-1" />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <Checkbox
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="w-5 h-5 rounded-lg border-gray-200 dark:border-gray-800 text-[#1F2BF3] focus:ring-[#1F2BF3]"
                                                />
                                            </div>
                                            <span className="ms-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {t('remember_device')}
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full group relative flex items-center justify-center py-5 bg-[#1F2BF3] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/30 overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <span className="relative z-10 flex items-center">
                                            {processing ? t('authenticating') : t('sign_in_hub')} 
                                            <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-12 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {t('powered_by')} <span className="text-[#1F2BF3]">TechWeb Engine</span> v2.0
                                    </p>
                                </div>
                            </div>
                            
                            {/* Decorative Corner Accents */}
                            <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#1F2BF3] rounded-2xl rotate-12 -z-10 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#00D8C0] rounded-full -z-10 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Graphic Elements */}
            <div className="absolute bottom-10 left-10 hidden xl:block opacity-10">
                <Zap size={200} className="text-[#1F2BF3] -rotate-12" />
            </div>
            <div className="absolute top-10 right-10 hidden xl:block opacity-10">
                <LayoutDashboard size={180} className="text-[#00D8C0] rotate-12" />
            </div>
        </div>
    );
}

function FeatureItem({ icon, label }) {
    return (
        <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-[#1F2BF3] transition-colors">
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
    );
}

function UnifiedIcon() {
    return <LayoutDashboard />;
}
