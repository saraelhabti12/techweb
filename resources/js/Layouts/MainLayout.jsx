// import React, { useEffect, useState } from "react";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";

// import Navbar from '@/Components/Navfoot/Navbar';
// import Footer from '@/Components/Navfoot/Footer';


// export default function MainLayout({ children }) {

//     const [isDark, setIsDark] = useState(false);

//     useEffect(() => {
//         setIsDark(document.documentElement.classList.contains('dark'));
//         const observer = new MutationObserver(() => {
//             setIsDark(document.documentElement.classList.contains('dark'));
//         });
//         observer.observe(document.documentElement, { attributes: true });
//         return () => observer.disconnect();
//     }, []);

//     const particlesInit = async (engine) => {
//         // this loads the tsparticles package bundle
//         await loadFull(engine);
//     };


//     return (
//          <div className={`relative min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
//             {/* Background animé */}
//             <Particles
//                 className="absolute inset-0 -z-10 "
//                 options={{
//                     background: { color: isDark ? "#000" : "#fff" },
//                     particles: {
//                         color: { value: isDark ? ["#00ffcc", "#cc00ff", "#ffffff"] : ["#333", "#888", "#ccc"] },
//                         move: { enable: true, speed: 1 },
//                         number: { value: 60 },
//                         opacity: { value: 0.7 },
//                         size: { value: 3 },
//                     },
//                 }}
//             />

//             {/* Bouton dark mode en haut à droite */}
//             <button
//                 onClick={() => document.documentElement.classList.toggle('dark')}
//                 className="fixed top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded z-20"
//             >
//                 Toggle Dark Mode
//             </button>


//         <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <main className="flex-1">
//                 {children}
//             </main>
//             <Footer />
//         </div>
//         </div>
//     );
// }



import React, { useEffect, useState } from "react";

import Navbar from "@/Components/Navfoot/Navbar";
import Footer from "@/Components/Navfoot/Footer";
import ParticleBackground from "@/Components/ParticleBackground";
import DarkModeToggle from "@/Components/DarkModeToggle";

export default function MainLayout({ children }) {
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
