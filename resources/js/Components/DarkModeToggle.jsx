import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // icônes modernes

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="ml-4 flex items-center rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-colors duration-300"
    >
      {/* Soleil */}
      <span
        className={`p-2 rounded-full transition ${
          !isDark ? "bg-white shadow text-yellow-500" : "text-gray-400"
        }`}
      >
        <Sun size={18} />
      </span>

      {/* Lune */}
      <span
        className={`p-2 rounded-full transition ${
          isDark ? "bg-white shadow text-indigo-400" : "text-gray-500"
        }`}
      >
        <Moon size={18} />
      </span>
    </button>
  );
}
