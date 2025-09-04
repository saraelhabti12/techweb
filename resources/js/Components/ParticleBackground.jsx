import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticleBackground({ isDark }) {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-10 pointer-events-none" // 👈 empêche le canvas de bloquer les clics
      options={{
        background: { color: isDark ? "#000" : "#fff" },
        particles: {
          color: {
            value: isDark
              ? ["#00ffcc", "#cc00ff", "#ffffff"]
              : ["#333", "#888", "#ccc"],
          },
          move: { enable: true, speed: 1 },
          number: { value: 60 },
          opacity: { value: 0.7 },
          size: { value: 3 },
        },
      }}
    />
  );
}
