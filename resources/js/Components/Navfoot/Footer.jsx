import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    
    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('projects'), href: '/Projects' },
        { name: t('about'), href: '/AboutUs' },
        { name: t('contact'), href: '/ContactUs' }
    ];

    const serviceLinks = [
        { name: t('web_development'), id: 'web-dev' },
        { name: t('mobile_apps'), id: 'mobile-apps' },
        { name: t('ui_ux_design'), id: 'ui-ux' },
        { name: t('digital_marketing'), id: 'digital-marketing' },
        { name: t('seo_services'), id: 'seo' }
    ];

    return (
        <footer className="bg-[#050505] text-white pt-32 pb-12 px-6 sm:px-12 lg:px-24 border-t border-white/5">
            <div className="max-w-[90rem] mx-auto">
                <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
                    <div>
                        <h2 className="text-[clamp(3rem,8vw,8rem)] font-black uppercase tracking-tighter leading-none mb-6">
                            TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]">WEB</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-md font-medium">
                            {t('innovative_desc')}
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/ContactUs" className="w-24 h-24 rounded-full bg-white text-gray-900 flex flex-col items-center justify-center hover:bg-[#1F2BF3] hover:text-white transition-all duration-500 group">
                            <ArrowRight className="w-6 h-6 mb-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('start')}</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 border-t border-white/10 pt-16">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">{t('navigation')}</h3>
                        <ul className="space-y-4">
                            {navLinks.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-lg font-bold text-white/70 hover:text-[#00D8C0] transition-colors hover:translate-x-2 inline-block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">{t('services')}</h3>
                        <ul className="space-y-4">
                            {serviceLinks.map(link => (
                                <li key={link.id}>
                                    <Link href="/" className="text-lg font-bold text-white/70 hover:text-[#00D8C0] transition-colors hover:translate-x-2 inline-block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">{t('headquarters_label')}</h3>
                        <address className="not-italic flex flex-col sm:flex-row gap-12">
                            <div>
                                <div className="text-lg font-bold text-white/70 mb-2">{t('footer_address')}</div>
                                <div className="text-lg font-bold text-white/70 mb-6">{t('footer_city')}</div>
                            </div>
                            <div>
                                <a href="mailto:info@techweb.ma" className="block text-lg font-bold text-white/70 hover:text-[#00D8C0] transition-colors mb-2">info@techweb.ma</a>
                                <a href="tel:+212607060769" className="block text-lg font-bold text-white/70 hover:text-[#00D8C0] transition-colors">+212 607 060 769</a>
                            </div>
                        </address>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                        © {new Date().getFullYear()} TechWeb. {t('all_rights_reserved')}
                    </p>
                    <div className="flex items-center gap-8">
                        {['LinkedIn', 'Twitter', 'Instagram', 'Facebook'].map(social => (
                            <a key={social} href="#" className="text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
