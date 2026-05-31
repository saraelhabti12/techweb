import React, { useMemo, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticleBackground({ isDark }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const options = useMemo(() => ({
    background: { color: "transparent" },
    particles: {
      color: {
        value: isDark
          ? ["#1F2BF3", "#00D8C0", "#ffffff"]
          : ["#1F2BF3", "#00D8C0", "#333333"],
      },
      move: { 
        enable: true, 
        speed: isMobile ? 0.2 : 0.4,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" }
      },
      number: { 
        value: isMobile ? 15 : 35,
        density: { enable: true, area: 1000 }
      },
      opacity: { 
        value: { min: 0.1, max: 0.3 },
        animation: {
            enable: !isMobile,
            speed: 0.5,
            sync: false
        }
      },
      size: { 
        value: { min: 1, max: isMobile ? 1.5 : 2 },
        animation: {
            enable: false, // Save CPU by disabling size animation
            speed: 1,
            sync: false
        }
      },
      links: {
        enable: !isMobile, // Disable links on mobile for major performance boost
        distance: 120,
        color: isDark ? "#ffffff" : "#1F2BF3",
        opacity: 0.04,
        width: 1
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: !isMobile,
          mode: "grab"
        }
      },
      modes: {
        grab: {
          distance: 180,
          links: { opacity: 0.1 }
        }
      }
    },
    fpsLimit: isMobile ? 30 : 60, // Limit FPS on mobile
    detectRetina: true
  }), [isDark, isMobile]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-[5] pointer-events-none"
      options={options}
    />
  );
}
