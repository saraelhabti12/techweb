import React, { useEffect, useState } from "react";
import Navbar from "@/Components/Navfoot/Navbar";
import Footer from "@/Components/Navfoot/Footer";
import ParticleBackground from "@/Components/ParticleBackground";
import DarkModeToggle from "@/Components/DarkModeToggle";

export default function MainLayout({ children, navbarTransparent = false }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Fond animé */}
      <ParticleBackground isDark={isDark} />
      {/* Structure de page */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
