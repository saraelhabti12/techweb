import { Link } from '@inertiajs/react';
import DarkModeToggle from '../DarkModeToggle';
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";


export default function Navbar({ transparent = false }) {

    const [openServices, setOpenServices] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState("up");

    useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) setScrollDirection("down");
      else setScrollDirection("up");
      lastScroll = currentScroll;
      setScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  //   const navbarClasses = `
  //   fixed top-0 left-0 w-full z-50 transition-all duration-700
  //   backdrop-blur-md bg-white/10 dark:bg-black/10
  //   ${scrollDirection === "down" ? "py-2 shadow-lg" : "py-6 shadow-none"}
  // `;


    return (
        // <header className="bg-white dark:bg-black shadow-sm sticky top-0 z-50">
        <header
          className={`fixed top-0 left-0 w-full z-50 transition-all backdrop-blur-sm ${
            transparent
              ? "bg-transparent shadow-none"
              : "bg-white/10 dark:bg-black/10 shadow-sm"
          }`}
        >

        {/* <header className={navbarClasses}> */}


      <div className="max-w-full mx-auto px-4">
      <div className="flex justify-between h-20 items-center -mt-2">
          <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 relative ml-10 mt-8">
                <img
                    className="h-24 w-auto block dark:hidden"
                    src="/images/logotechweb.png"
                    alt="TechWeb"
                />
                <img
                    className="h-20 w-auto hidden dark:block"
                    src="/images/logo3.png"
                    alt="TechWeb Dark"
                />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 mt-12">
              <Link
              href="/"
              className="relative text-black dark:text-white font-medium
                        after:content-[''] after:block after:h-[4px]
                        after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        hover:after:scale-x-100 hover:after:origin-left"
            >
              Home
            </Link>

              <Link href={route('AboutUs')} 
              className="relative text-black dark:text-white font-medium
                        after:content-[''] after:block after:h-[4px]
                        after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        hover:after:scale-x-100 hover:after:origin-left">
                  About Us
              </Link>
              {/* <button
                  onClick={() => setOpenServices(!openServices)}
                  className="relative text-black dark:text-white font-medium
                        after:content-[''] after:block after:h-[4px]
                        after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        hover:after:scale-x-100 hover:after:origin-left"
                  >
                  Services
                  <ChevronDownIcon
                      className={`w-5 h-5 transition-transform ${
                      openServices ? "rotate-180" : "rotate-0"
                      }`}
                  />
              </button> */}





              {/* <button
                onClick={() => setOpenServices(!openServices)}
                className="relative text-black dark:text-white font-medium
                          after:content-[''] after:block after:h-[4px]
                          after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right
                          after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                          after:transition-transform after:duration-500
                          hover:after:scale-x-100 hover:after:origin-left"
              >
                <span className="inline-flex items-center">
                  Services
                  <ChevronDownIcon
                    className={`w-5 h-5 ml-1 transition-transform ${
                      openServices ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </button> */}



              <button
  onMouseEnter={() => setOpenServices(true)} // ouvre le menu
  className="relative text-black dark:text-white font-medium
             after:content-[''] after:block after:h-[4px]
             after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right
             after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
             after:transition-transform after:duration-500
             hover:after:scale-x-100 hover:after:origin-left"
>
  <span className="inline-flex items-center">
    Services
    <ChevronDownIcon
      className={`w-5 h-5 ml-1 transition-transform ${
        openServices ? "rotate-180" : "rotate-0"
      }`}
    />
  </span>
</button>





              <Link href={route('Projects')} 
              className="relative text-black dark:text-white font-medium
                        after:content-[''] after:block after:h-[4px]
                        after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        hover:after:scale-x-100 hover:after:origin-left">
                  Projects
              </Link>
              <Link href={route('ContactUs')} 
              className="relative text-black dark:text-white font-medium
                        after:content-[''] after:block after:h-[4px]
                        after:w-[130%] after:mt-2 after:-ml-[15%] after:scale-x-0 after:origin-right
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        hover:after:scale-x-100 hover:after:origin-left">
                  Contact Us
              </Link>

          {/* Mega Menu */}
  {openServices && (
    // <div className="absolute top-24 left-0 w-full bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-50">
      <div
    onMouseEnter={() => setOpenServices(true)}  // reste ouvert si on survole le menu
    onMouseLeave={() => setOpenServices(false)} // se ferme quand on quitte le menu
    className="absolute top-24 left-0 w-full bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-50"
  >
      <div className="max-w-7xl mx-auto px-8 py-36 pb-36 grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
        
        {/* Colonne 1 */}
        <div className="flex flex-col justify-between h-full">
          <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-8
             after:content-[''] after:block after:h-[3px] after:w-16
             after:mt-2 after:ml-0
             after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]">
            WEB SOLUTIONS
          </h3>

          <div className="mb-18">
            {/* <h4 className="font-semibold text-blue-700 leading-relaxed mb-4">
              Website Creation
            </h4> */}
            <h4
              className="relative font-semibold leading-relaxed mb-4
                        bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                        bg-clip-text text-transparent
                        after:content-[''] after:block after:h-[3px]
                        after:w-[120%] after:mt-2 after:-ml-[10%]
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        after:scale-x-0 after:origin-right
                        hover:after:scale-x-100 hover:after:origin-left
                        cursor-pointer"
            >
              Website Creation
            </h4>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
              Custom-made, high-performance websites adapted to your needs.
            </p>
          </div>

          <div className="mb-8">
            <h4 className="relative font-semibold leading-relaxed mb-4
                        bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                        bg-clip-text text-transparent
                        after:content-[''] after:block after:h-[3px]
                        after:w-[120%] after:mt-2 after:-ml-[10%]
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        after:scale-x-0 after:origin-right
                        hover:after:scale-x-100 hover:after:origin-left
                        cursor-pointer">
              E-commerce Website Creation 
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
              Online stores optimized to boost your sales and offer a seamless customer experience.
            </p>
          </div>
        </div>

      {/* Colonne 2 */}
      <div className="flex flex-col justify-between h-full">
        <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-8
             after:content-[''] after:block after:h-[3px] after:w-16
             after:mt-2 after:ml-0
             after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]">
          MARKETING SOLUTIONS
        </h3>

        <div className="mb-18">
          <h4 className="relative font-semibold leading-relaxed mb-4
                        bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                        bg-clip-text text-transparent
                        after:content-[''] after:block after:h-[3px]
                        after:w-[120%] after:mt-2 after:-ml-[10%]
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        after:scale-x-0 after:origin-right
                        hover:after:scale-x-100 hover:after:origin-left
                        cursor-pointer">SEO Referencing</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
            Improve your search engine ranking to attract more qualified traffic.
          </p>
        </div>

        <div className="mb-12">
          <h4 className="relative font-semibold leading-relaxed mb-4
                        bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                        bg-clip-text text-transparent
                        after:content-[''] after:block after:h-[3px]
                        after:w-[120%] after:mt-2 after:-ml-[10%]
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        after:scale-x-0 after:origin-right
                        hover:after:scale-x-100 hover:after:origin-left
                        cursor-pointer">Advertising & Ads</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
            Attract more customers with targeted and effective advertising campaigns.
          </p>
        </div>
      </div>

      {/* Colonne 3 */}
      <div className="flex flex-col ">
        <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-8
             after:content-[''] after:block after:h-[3px] after:w-16
             after:mt-2 after:ml-0
             after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]">
          VISUAL SOLUTIONS
        </h3>

        <div className="mb-18">
          <h4 className="relative font-semibold leading-relaxed mb-4
                        bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                        bg-clip-text text-transparent
                        after:content-[''] after:block after:h-[3px]
                        after:w-[120%] after:mt-2 after:-ml-[10%]
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        after:scale-x-0 after:origin-right
                        hover:after:scale-x-100 hover:after:origin-left
                        cursor-pointer">Graphic Design</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
            Create a unique and memorable identity for your brand with a custom logo.
          </p>
        </div>

        <div className="mb-12">
          <h4 className="relative font-semibold leading-relaxed mb-4
                        bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                        bg-clip-text text-transparent
                        after:content-[''] after:block after:h-[3px]
                        after:w-[120%] after:mt-2 after:-ml-[10%]
                        after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]
                        after:transition-transform after:duration-500
                        after:scale-x-0 after:origin-right
                        hover:after:scale-x-100 hover:after:origin-left
                        cursor-pointer">Video Editing</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
            Enhance your content with professional video editing that captivates and engages your audience.
          </p>
        </div>
      </div>

       {/* Colonne 4  */}
      <div >
        <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-8
             after:content-[''] after:block after:h-[3px] after:w-16
             after:mt-2 after:ml-0
             after:bg-gradient-to-r after:from-[#1F2BF3] after:to-[#00D8C0]">
          ABOUT US
        </h3>

        <div className="mb-6">
          <h4 className="font-semibold text-blue-600 leading-relaxed">
            We are a passionate team dedicated to creating innovative digital solutions to help your business grow.
          </h4>
        </div>

    <Link
      href={route("AboutUs")}
      className="inline-block min-w-[200px] px-8 py-3 font-semibold text-white
                bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                rounded-2xl shadow-md shadow-[#1F2BF3]/40
                transition-all duration-100
                hover:brightness-110 hover:scale-90 cursor-pointer text-center"
    >
      Learn More
    </Link>

      </div>

      {/* Colonne 5 avec Image */}
      <div className="flex justify-center items-center">
        <img
          src="/images/pro1.jpg"
          alt="Services Preview"
          className="rounded-xl shadow-lg w-full h-96 object-cover"
        />
      </div>
    </div>
  </div>
)}
</nav>

    <div className="flex items-center space-x-3 mt-8 mr-12">
      {/* <Link
        href={route('login')}
        className="px-4 py-2 text-sm font-medium text-white
                  bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                  rounded-2xl shadow-md shadow-[#1F2BF3]/40
                  transition-all duration-200
                  hover:brightness-110 hover:scale-95 cursor-pointer text-center"
      >
        Sign Up
      </Link> */}

      <Link
        href="/ContactUs"
        className="px-4 py-2 text-sm font-medium text-white
                  bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                  rounded-2xl shadow-md shadow-[#1F2BF3]/40
                  transition-all duration-200
                  hover:brightness-110 hover:scale-95 cursor-pointer text-center"
      >
        ESTIMATE YOUR PROJECT
      </Link>

      <Link
      href={route('login')}
      className="px-4 py-2 text-sm font-medium
                text-gray-800 dark:text-white
                bg-white/20 dark:bg-black/10
                rounded-2xl shadow-md shadow-[#1F2BF3]/20
                transition-all duration-200
                hover:bg-gradient-to-r hover:from-[#1F2BF3] hover:to-[#00D8C0]
                hover:brightness-110 hover:scale-95
                cursor-pointer text-center"
    >
      Sign Up
    </Link>

      <DarkModeToggle />
    </div>

                </div>
            </div>
        </header>
    );
}