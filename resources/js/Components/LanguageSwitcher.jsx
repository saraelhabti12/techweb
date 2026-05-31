import React from 'react';
import { useTranslation } from 'react-i18next';

const UKFlag = () => (
    <svg className="w-5 h-4 rounded-[2px] shadow-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
);

const FRFlag = () => (
    <svg className="w-5 h-4 rounded-[2px] shadow-sm" viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
        <rect width="1" height="2" fill="#002395"/>
        <rect width="1" height="2" x="1" fill="#fff"/>
        <rect width="1" height="2" x="2" fill="#ED2939"/>
    </svg>
);

export default function LanguageSwitcher({ forceWhite = false }) {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(newLang);
    };

    const isEn = i18n.language === 'en';

    return (
        <button
            onClick={toggleLanguage}
            title={isEn ? "Switch to French" : "Switch to English"}
            className={`group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border ${
                forceWhite
                    ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 shadow-sm hover:border-[#1F2BF3]'
            }`}
        >
            <div className="transition-transform duration-300 group-hover:scale-110">
                {isEn ? <UKFlag /> : <FRFlag />}
            </div>
        </button>
    );
}
