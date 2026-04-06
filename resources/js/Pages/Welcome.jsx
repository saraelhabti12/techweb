import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef , useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import Navbar from '@/Components/Navfoot/Navbar';

export default function HomePage({ blogs, templat}) {

            const slides = [
            {
                id: "01",
                image: "images/pro1.jpg",
                title: "Professional Website Development",
                subtitle: "Web Development And Design",
                text: "As your digital marketing agency, we build conversion-focused websites combining cutting-edge design with performance-driven functionality."
            },
            {
                id: "02",
                image: "images/pro2.jpg",
                title: "Creative Design",
                subtitle: "Graphic Design",
                text: "We create impactful and unique visuals to strengthen your brabd image.Logos,posters,banners,and more-our creativity transforms your ideas into unfogettable designs."
            },
            {
                id: "03",
                image: "images/pro1.jpg",
                title: "Online Growth",
                subtitle: "Digital Marketing Services",
                text: "Boost your online visibility with innovative marketing strategies,From social media management to advertissing campaigns,we maximize your digital presence."
            },
            {
                id: "04",
                image: "images/pro2.jpg",
                title: "Search Optimization",
                subtitle: "SEO & Marketing",
                text: "Improve your Google rankings and attractbmore visitors with our SEO expertises content optimization , backlinks,and technical audits for effective SEO."
            },
            {
                id: "05",
                image: "images/pro1.jpg",
                title: "Tech Support",
                subtitle: "IT Solutions",
                text: "Secure and optimize your IT infrastructure with our tailored solutions.From hosting to cybersecurity and yechnical support,we ensure your business's performance."
            },
            {
                id: "06",
                image: "images/pro2.jpg",
                title: "Visual Storytelling",
                subtitle: "Video Editing",
                text: "We craft hight-quality,engaging videos tailored to your brand's needs.Form promotional ads and social media content to corporate videos and motion graphics,our expert editing enhances your storytelling and captivates your audience."
            }
            ];

            const [current, setCurrent] = useState(0);

            const prevSlide = () => {
            setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
            };
            const nextSlide = () => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            };

            const [aboutOffset, setAboutOffset] = useState(0);
            useEffect(() => {
                const handleScrollAbout = () => {
                setAboutOffset(window.scrollY * -0.3); 
                };

                window.addEventListener("scroll", handleScrollAbout);
                return () => window.removeEventListener("scroll", handleScrollAbout);
            }, []);

            const [approachOffset, setApproachOffset] = useState(0);
            const approachRef = useRef(null);

            useEffect(() => {
            const handleScrollApproach = () => {
                if (approachRef.current) {
                const rect = approachRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight && rect.bottom > 0) {
                    setApproachOffset((window.scrollY - rect.top) * -0.2);
                }
                }
            };

            window.addEventListener("scroll", handleScrollApproach);
            return () => window.removeEventListener("scroll", handleScrollApproach);
            }, []);

            const { templates } = usePage().props;
            const [selectedCategory, setSelectedCategory] = useState("All");

            const categories = ["All",...new Set(templates.map((t) => t.category))];

            const filteredProjects =
                selectedCategory === "All"
                ? templates
                : templates.filter((p) => p.category === selectedCategory);

            const [contactOffset, setContactOffset] = useState(0);
            const contactRef = useRef(null);

            useEffect(() => {
                const handleScrollContact = () => {
                if (contactRef.current) {
                    const rect = contactRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top < windowHeight && rect.bottom > 0) {
                    setContactOffset((window.scrollY - rect.top) * -0.2);
                    }
                }
                };

            window.addEventListener("scroll", handleScrollContact);
                return () => window.removeEventListener("scroll", handleScrollContact);
            }, []);

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
                post(route('contact.store'), {
                onSuccess: () => reset(),
                });
            };


            const [reviewsOffset, setreviewsOffset] = useState(0);
            const reviewsRef = useRef(null);

            useEffect(() => {
                const handleScrollReviews = () => {
                if (reviewsRef.current) {
                    const rect = reviewsRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top < windowHeight && rect.bottom > 0) {
                    setreviewsOffset((window.scrollY - rect.top) * -0.2);
                    }
                }
                };

            window.addEventListener("scroll", handleScrollReviews);
                return () => window.removeEventListener("scroll", handleScrollReviews);
            }, []);

            const testimonials = [
                        {
                        rating: 4,
                        title: "TechWeb a transformé notre présence en lign avec un site moderne et performant.L'équipe est professionnelle et réactive.je recommande vivement !",
                        text1: "Ahmed BenKacem",
                        text2: "Marketing Manager",
                        
                        },
                        {
                        rating: 5,
                        title: "Grace à leur expertise en SEO ,notre trafic a considérablement augmenté.Des rèsultats concrets et une collaboration efficace !",
                        text1: "Sofia El Amrani",
                        text2: "SEO",
                        
                        },
                        {
                        rating: 4,
                        title: "Un services impeccable et un support technique toujours disponible.TechWeb est un partenaire de confiance pour notre transformation digitale.",
                        text1: "Yassine Mourad",
                        text2: "Dot Journal",
                        
                        }
                    ];

                const [index, setIndex] = useState(0);

                const prev = () => {
                    setIndex(index === 0 ? testimonials.length - 1 : index - 1);
                };

                const next = () => {
                    setIndex(index === testimonials.length - 1 ? 0 : index + 1);
                };

                const [blogsOffset, setBlogsOffset] = useState(0);
                const blogsRef = useRef(null);

                useEffect(() => {
                const handleScrollBlogs = () => {
                    if (blogsRef.current) {
                    const rect = blogsRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top < windowHeight && rect.bottom > 0) {
                        setBlogsOffset((window.scrollY - rect.top) * -0.2);
                    }
                    }
                };

                window.addEventListener("scroll", handleScrollBlogs);
                return () => window.removeEventListener("scroll", handleScrollBlogs);
                }, []);

        
      return (
        <MainLayout>

            <Head title="Digital Marketing Agency Morocco | Web,SEO & Design" />
            <div
            className="relative min-h-screen overflow-hidden"
            style={{
                background: 'radial-gradient(circle at 20% 30%, rgba(0, 0, 255, 0.05), transparent 80%), radial-gradient(circle at 80% 70%, rgba(0, 150, 255, 0.05), transparent 80%)',
            }}
            >
            
        <section className="relative h-screen w-full flex items-center overflow-hidden pt-20 transition-colors duration-500">

                    {/* Fumée bleue */}
                    <div
                        className="absolute inset-0"
                        style={{
                        background: 'url(/images/blue-smoke.png) center/cover no-repeat',
                        opacity: 0.2,
                        mixBlendMode: 'screen',
                        zIndex: 1,
                        }}
                    ></div>

                    {/* Image principale */}
                    <picture 
                        className="absolute top-1/2 left-1/2 z-10"
                        style={{ transform: 'translate(-50%, -50%) translateX(300px)' }}
                    >
                        <source srcSet="/images/bgwelcome2.jpg" type="image/png" />
                        <img
                        src="/images/bgwelcome4nobg.png"
                        alt="Decoration"
                        className="max-h-[120%] object-contain drop-shadow-[0_0_100px_rgba(75,0,130,0.5)] opacity-90"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, purple 80%, transparent 100%), linear-gradient(to left, blue 85%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to left, black 85%, transparent 100%)',
                            maskComposite: 'intersect',
                            WebkitMaskComposite: 'destination-in',
                            filter: 'blur(0.1px)',
                            WebkitFilter: 'blur(0.1px)',
                        }}
                        />
                    </picture>

                    <div className="container mx-auto relative z-20 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                    {/* Texte et bouton */}
                    <div className="flex flex-col items-start justify-center px-4 md:pl-16 text-black dark:text-white transition-colors duration-500 space-y-6">
                        
                    <h1 className="text-8xl md:text-6xl font-extrabold leading-tight
                            bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] 
                            bg-clip-text text-transparent
                            dark:drop-shadow-[0_0_10px_rgba(31,43,243,0.6)] 
                            drop-shadow-none">
                        TechWeb
                    </h1>

                    <p className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify">
                    Connected Creativity. At TechWeb, we craft innovative digital experiences that inspire, engage, and leave a lasting impression.  
                    From advanced web design to seamless user experiences, our mission is to transform your vision into a vibrant digital reality.  
                    Let your ideas shine — with TechWeb at your side.
                    </p>

                {/* Bouton Contact Us comme Learn More */}
                    <Link
                    href="/ContactUs"
                    className="inline-block min-w-[200px] px-8 py-3 font-semibold text-white
                                bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                                rounded-2xl shadow-md shadow-[#1F2BF3]/40
                                transition-all duration-100
                                hover:brightness-110 hover:scale-90 cursor-pointer text-center"
                    >
                    Contact Us
                    </Link>
            </div>
            </div>
        </section>
            
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black px-8 md:px-16 lg:px-32 pb-16 mt-16">


            {/* Section 2 */}

    <section className="relative bg-white dark:bg-black text-gray-900 dark:text-white py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex justify-center md:justify-start md:pl-12">
            <img 
                src="/images/service1.jpg" 
                alt="Service" 
                className="w-80 h-auto object-contain rounded-xl shadow-lg"
            />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-start gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight font-sans">
                Drive Growth With A Top-Tier Digital Marketing Agency
            </h1>
            <p className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify">
                Looking to take your brand to the next level? Our digital marketing agency offers powerful, results-driven solutions to boost your 
                online presence, increase traffic, and drive real growth. From SEO and paid advertising to web development and content creation, 
                we help businesses thrive in the digital world with tailored strategies and measurable results.
            </p>
            </div>
        </div>
    </section>


        {/* Section About Us */}

        <section className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center">
            <h1
                style={{
                transform: `translateX(${aboutOffset + 200}px)`,
                background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                }}
                className="text-[8rem] font-extrabold tracking-wide transition-transform duration-100 -mt-40"
            >
                ABOUT US
            </h1>
        </section>          

            {/* section who we are */}

            <section className="py-20 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-0">
                {/* Ligne 1 : Texte + Image */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 -mt-24">

                <h2
                className="text-5xl font-extrabold mb-6 tracking-wide inline-block"
                style={{
                    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
                >
                Who We Are ?
                </h2>
    
  <div className="flex flex-col items-start gap-2">
    {/* <img src="/icons/innovation.svg" alt="Innovation" className="w-6 h-6" /> */}
    <p className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300">
      Business Innovation
    </p>
    <span className="block h-[4px] w-[160px] bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-full"></span>
  </div>


  <p className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify">
    TechWeb: Your full-service digital marketing agency specializing in results-driven web design, e-commerce solutions, and strategic online growth.
  </p>
</div>


                    <div>
                        <img
                        src="images/weare1.jpg"
                        alt="Digital Strategy"
                        className="rounded-xl shadow-lg w-full h-80 object-cover"
                        />

                <Link
                    href="/AboutUs"
                    className="inline-block px-8 py-2 text-lg font-semibold text-white
                                bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                                rounded-2xl shadow-md shadow-[#1F2BF3]/40
                                transition-all duration-200
                                hover:brightness-110 hover:scale-95 cursor-pointer text-center
                                mt-6 ml-4"
                    >
                    Explore
                </Link>

                    </div>
                </div>

                {/* Ligne 2 : Image + Texte */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                <img
                    src="images/pro2.jpg"
                    alt="Creative Solutions"
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                />
                
                </div>
                        <div className="space-y-6 -mt-24">
                        <div className="flex flex-col items-start gap-2">
                            <h2
                                className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300"
                            >
                                Search Engine Optimization
                            </h2>
                            <span className="block h-[4px] w-[230px] bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-full"></span>
                        </div>

                        <p className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify">
                            Increase your online visibility and attract more traffic with our comprehensive SEO strategies. We optimize your search rankings and enhance your digital presence, ensuring you reach and engage your target audience effectively.
                        </p>
                        </div>
                </div>

                </div>
            </section>


            {/* Section full services digital marketing  */}

            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-6">
    


<div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-3xl min-h-[24rem] mx-auto">
  <div className="flex items-center gap-4 mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-24 h-24"
    >
      <defs>
        <linearGradient id="techweb-gradient-check" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1F2BF3" />
          <stop offset="100%" stopColor="#00D8C0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#techweb-gradient-check)"
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>

    <h3 className="text-2xl md:text-2xl font-extrabold text-gray-900 dark:text-white w-full break-words">
      Full-Service Digital Marketing
    </h3>
  </div>

  <p className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify mt-16">
    Empowering businesses with cutting-edge digital solutions, ensuring efficiency and growth in a fast-evolving world.
  </p>
</div>






            {/* Bloc 2 */}
        
            <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-3xl min-h-[24rem] mx-auto">
        <div className="flex items-center gap-4 mb-4">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-24 h-24"
            >
            <defs>
                <linearGradient id="techweb-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1F2BF3" />
                <stop offset="100%" stopColor="#00D8C0" />
                </linearGradient>
            </defs>
            <path
                fill="url(#techweb-gradient)"
                d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z"
            />
            <path
                fill="url(#techweb-gradient)"
                fillRule="evenodd"
                d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z"
                clipRule="evenodd"
            />
            </svg>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white w-full break-words">
            Data-Driven Marketing Strategies
            </h3>
        </div>

        <p className="mt-16 text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify">
            Crafting unique strategies tailored to your goals, blending creativity and insight to drive long-term success.
        </p>
        </div>


        {/* Bloc 3 */}
        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-3xl min-h-[24rem] mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-24 h-24"
                >
                <defs>
                    <linearGradient id="techweb-gradient-heart" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1F2BF3" />
                    <stop offset="100%" stopColor="#00D8C0" />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#techweb-gradient-heart)"
                    fillRule="evenodd"
                    d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                    clipRule="evenodd"
                />
                </svg>

                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white w-full break-words">
                Performance-Focused Campaign Management
                </h3>
            </div>

            <p className="mt-16 text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify">
                From idea to execution, we ensure seamless implementation and continuous improvement for lasting impact.
            </p>
            </div>

            </div>
        </div>
        </section>


             {/* Section news ticker */}

             <section className="bg-white dark:bg-black py-24 overflow-hidden mt-10">
                    <div className="flex whitespace-nowrap">
                        <div className="flex items-center text-xl font-bold text-gray-800 dark:text-white animate-marquee">
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Website</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Brand communication</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Vidéo Editing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Advertissing & Ads </span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Vidéo Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Website Design</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Vidéo Editing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">SEO & Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">E-Commerce Website Création</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Graphic Design</span>

                        </div>

                        <div className="flex items-center text-xl font-bold text-gray-800 dark:text-white animate-marquee">
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Website</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Brand communication</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Vidéo Editing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Advertissing & Ads </span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Vidéo Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Website Design</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Vidéo Editing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">SEO & Marketing</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">E-Commerce Website Création</span>
                        <span className="mx-6 inline-block w-20 h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></span>
                        <span className="px-6">Graphic Design</span>
                        </div>
                    </div>
            </section>



             {/* Section APPROACH */}

            <section
                ref={approachRef}
                className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center translate-y-12"
            >
                <h1
                    style={{
                        transform: `translateX(${approachOffset + 500}px) translateY(-140px)`,
                        background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                    className="text-[8rem] font-extrabold tracking-wide transition-transform duration-100"
                >
                    Approach
                </h1>
            </section>


         {/* section digital marketing agency services*/}

            <section className="pt-24 pb-24 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ">
                {/* Titre principal */}
                <div className="container mx-auto text-center mb-12">
                    <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white" 
                    style={{
                    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: "1.5"
                }}>
                    Digital Marketing Agency Services
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                    Integrated Solutions for Online Business Growth
                    </p>
                </div>

                {/* Slide actif */}
                <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative translate-x-10">
                    {/* Image */}
                    <div>
                    <img
                        src={slides[current].image}
                        alt={slides[current].title}
                        className="rounded-lg shadow-lg w-full transform scale-110"
                    />
                    </div>

                    {/* Texte */}
                    <div className="relative">
                    {/* Numéro en arrière-plan */}
                    <span className="absolute -top-40 left-0 text-gray-900 dark:text-gray-100 text-[250px] font-bold opacity-20 ">
                        {slides[current].id}
                    </span>

                    <h3 className="text-4xl md:text-5xl font-extrabold leading-tight
                                    bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                                    bg-clip-text text-transparent
                                    relative inline-block mb-4 pb-5">
                        {slides[current].title}
                    </h3>
                    <h4 className="text-gray-900 dark:text-white mb-4 relative pb-2 pl-6 text-xl">
                        {slides[current].subtitle}
                        {/* <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-full"></span> */}
                        <span className="absolute left-0 bottom-[-4px] w-[60%] h-1 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-full"></span>
                    </h4>
                    {/* <p className="text-gray-600 dark:text-gray-300 relative"> */}
                    <p className="text-lg md:text-base max-w-3xl leading-relaxed md:leading-loose font-sans text-gray-800 dark:text-gray-300 text-justify mt-10">
                        {slides[current].text}
                    </p>
                    </div>
                </div>

                {/* Boutons navigation */}

                <div className="mt-8 -mb-6 flex justify-center gap-6">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full text-white
                                bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                                shadow-md shadow-[#1F2BF3]/40
                                transition-all duration-200
                                hover:brightness-110 hover:scale-95 cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full text-white
                                bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                                shadow-md shadow-[#1F2BF3]/40
                                transition-all duration-200
                                hover:brightness-110 hover:scale-95 cursor-pointer"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>

        {/* our projects*/}

        <section className="py-16 bg-gray-100 dark:bg-gray-900">
            <div className="text-center mb-10">
                <h2 className="text-7xl font-bold mb-6 text-gray-900 dark:text-white" 
                    style={{
                    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: "1.5"
                }}>
                    Our Projects
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Discover a compilation of our most remarkable projects
                </p>
            </div>
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => (
                <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 shadow-md shadow-[#1F2BF3]/40
                    ${
                    selectedCategory === cat
                        ? "bg-[#1F2BF3] text-white scale-110" // bouton actif : couleur unique + plus grand
                        : "bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white hover:brightness-110 hover:scale-95"
                    }`}
                >
                {cat}
                </button>
            ))}
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {filteredProjects.map((project) => (
                        <div
                        key={project.id}
                        className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden w-[350px] h-[580px] mx-auto group"
                        >
                        <div className="w-full h-[75%] overflow-hidden relative">
                            <img
                            src={project.image}
                            alt={project.title}
                            className="
                                absolute top-0 left-0 w-full h-auto
                                transition-transform duration-[1500ms] ease-in-out
                                group-hover:-translate-y-[calc(100%-360px)]
                            "
                            />
                </div>
                <div className="p-4 text-center">
                    <h3
                    className="text-xl font-bold bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] bg-clip-text text-transparent mb-2"
                    >
                    {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                    {project.description}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </section>


            {/* Section CONTACT */}
            <section
                ref={contactRef}
                className="relative bg-gray-100 dark:bg-gray-900 py-20 overflow-hidden flex items-center justify-center"
            >
                <h1
                    style={{
                        transform: `translateX(${contactOffset * 0.5 + 500}px)`,
                        background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                    className="text-[8rem] font-extrabold tracking-wide transition-transform duration-100"
                >
                    Contact
                </h1>
            </section>


    {/* Section formulaire contact us */}

            <section className="py-20 bg-gray-100 dark:bg-gray-900">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2
                        className="text-7xl font-extrabold mb-6 relative inline-block dark:text-white text-black"
                        style={{
                            lineHeight: "1.3",
                        }}
                        >
                        Contact Us
                        <span
                            className="block h-1 mt-2 rounded"
                            style={{
                            width: "100%",
                            background: "linear-gradient(to right, #1F2BF3, #00D8C0)"
                            }}
                        ></span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-4">
                        Ask Our Experts
                    </p>
                    </div>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="pl-10 md:pl-24">
                    <h2
                        className="text-6xl md:text-7xl font-extrabold mb-6 inline-block"
                        style={{
                            background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                        >
                        Connect Customers To Your Business
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Let's talk business
                        <span
                            className="block h-0.5 mt-2 rounded"
                            style={{
                            width: "35%", 
                            background: "linear-gradient(to right, #1F2BF3, #00D8C0)"
                            }}
                        ></span>
                    </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                        </label>
                        <input
                        type="text"
                        required
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-[#1F2BF3] focus:border-[#1F2BF3]"
                        />
                        {errors.full_name && <div className="text-red-500 text-sm">{errors.full_name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Number
                        </label>
                        <input
                        type="tel"
                        required
                        value={data.contact_number}
                        onChange={(e) => setData('contact_number', e.target.value)}
                        placeholder="+212 600 000 000"
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-[#1F2BF3] focus:border-[#1F2BF3]"
                        />
                        {errors.contact_number && <div className="text-red-500 text-sm">{errors.contact_number}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                        </label>
                        <input
                        type="text"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        placeholder="Your Company"
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-[#1F2BF3] focus:border-[#1F2BF3]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                        </label>
                        <input
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="example@email.com"
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-[#1F2BF3] focus:border-[#1F2BF3]"
                        />
                        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    </div>
                    <div> 
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Choose a Service
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                        {["Website Creation","E-commerce Website","Photography","SEO & Marketing","Graphic Design","Ads & Advertising"].map((service) => (
                            <label key={service} className="flex items-center space-x-2 text-gray-900 dark:text-white">
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
                                className="text-[#1F2BF3] focus:ring-[#1F2BF3]"
                            />
                            <span>{service}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        How can we help you?
                        </label>
                        <textarea
                        rows="4"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder="Describe your project or issue..."
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-[#1F2BF3] focus:border-[#1F2BF3]"
                        />
                    </div>
                    <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`px-20 py-3 rounded-full font-medium transition-all duration-200 shadow-md shadow-[#1F2BF3]/40
                        bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white hover:brightness-110 hover:scale-95`}
                    >
                        {processing ? 'Sending...' : 'Submit'}
                    </button>
                    </div>
                    </form>
                </div>
                </div>
            </section>

     {/* Section REVIEWS */}   
        <section
            ref={reviewsRef}
            className="relative bg-gray-100 dark:bg-gray-900 py-32 overflow-hidden flex items-center justify-center"
        >
            <h1
                style={{
                    transform: `translateX(${reviewsOffset * 0.3 + 500}px) translateY(-50px)`,
                    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
                className="text-[8rem] font-extrabold tracking-wide transition-transform duration-100"
            >
                Reviews
            </h1>
        </section>


    {/* Section Testimonials etoiles */}

    <section className="py-16 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto text-center max-w-4xl">
                <h2
                className="text-5xl md:text-6xl font-extrabold mb-12"
                style={{
                    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                    lineHeight: "1.3",
                }}
                >
                Why Businesses Choose Our Digital Marketing Agency
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-16 md:p-40">
                <div className="flex justify-center mb-12">
                {[...Array(5)].map((_, i) => (
                    <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={48}
                    height={48}
                    className="mr-2"
                    >
                    <defs>
                        <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1F2BF3" />
                        <stop offset="100%" stopColor="#00D8C0" />
                        </linearGradient>
                    </defs>
                    <path
                        fill={i < testimonials[index].rating ? `url(#grad-${i})` : "#D1D5DB"} 
                        d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
                    />
                    </svg>
                ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6 leading-relaxed">
                    “{testimonials[index].title}”
                </h3>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {testimonials[index].text1}
                </p>
                <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
                    {testimonials[index].text2}
                </p>
                <div className="mt-8 -mb-6 flex justify-center gap-6">
                <button
                onClick={prev}
                className="p-3 rounded-full text-white
                            bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                            shadow-md shadow-[#1F2BF3]/40
                            transition-all duration-200
                            hover:brightness-110 hover:scale-95 cursor-pointer"
                >
                <ChevronLeft size={24} />
                </button>
                <button
                onClick={next}
                className="p-3 rounded-full text-white
                            bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                            shadow-md shadow-[#1F2BF3]/40
                            transition-all duration-200
                            hover:brightness-110 hover:scale-95 cursor-pointer"
                >
                <ChevronRight size={24} />
                </button>
            </div>
            </div>
        </div>
    </section>

        {/* Section clients numbers */}
        <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-14 text-center">
            {/* Clients */}
            <div>
            <h3
                className="text-5xl md:text-6xl font-extrabold mb-2"
                style={{
                background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                }}
            >
            </h3>
            <p className="mt-3 text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Clients
            </p>
            </div>

            {/* Projects */}
            <div>
            <h3
                className="text-5xl md:text-6xl font-extrabold mb-2"
                style={{
                background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                }}
            >
                78
            </h3>
            <p className="mt-3 text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Projects
            </p>
            </div>

            {/* Cities */}
            <div>
            <h3
                className="text-5xl md:text-6xl font-extrabold mb-2"
                style={{
                background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                }}
            >
                12
            </h3>
            <p className="mt-3 text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Cities
            </p>
            </div>

            {/* Awards */}
            <div>
            <h3
                className="text-5xl md:text-6xl font-extrabold mb-2"
                style={{
                background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                }}
            >
                60
            </h3>
            <p className="mt-3 text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Awards
            </p>
            </div>
        </div>
        </section>


            <section
    ref={blogsRef}
    className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center"
>

    <h1
        style={{
            transform: `translateX(${blogsOffset * 0.3 + 500}px)`,
            background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        }}
        className="text-[8rem] font-bold tracking-wide transition-transform duration-100 -mt-24"
    >
        Our Blogs
    </h1>

</section>



    {/* Section 3 derniers blogs */}
      <section className="py-28 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {blogs.map((blog) => {
                // Utiliser d'abord images JSON, sinon fallback sur le contenu HTML
                const firstImage =
                    blog.images && blog.images.length > 0
                    ? blog.images[0]
                    : blog.content.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;

                return (
                    <Link
                    key={blog.id}
                    href={`/blogs/${blog.id}`}
                    className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition min-h-[500px] flex flex-col"
                    >
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {blog.title}
                    </h3>

                    <div className="flex items-center mb-6 gap-2">
                        {/* <div className="w-8 h-1 bg-purple-600 rounded"></div> */}
                        <div
  className="w-16 h-1 rounded"
  style={{
    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
  }}
></div>

                        <p className="text-lg text-gray-600 dark:text-gray-400">By techweb</p>
                    </div>

                    {firstImage && (
                        <img
                        src={firstImage}
                        alt={blog.title}
                        className="w-full h-60 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300"
                        />
                    )}

                    <p className="text-lg text-gray-700 dark:text-gray-300 mt-auto">
                        {blog.category ?? "Uncategorized"}
                    </p>
                    </Link>
                );
                })}
            </div>

        {/* Bouton “Voir tous les blogs” */}
        {/* <div className="mt-8 text-center">
            <Link
            href="/blogs"
            className="px-12 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
            >
            Voir tous les blogs
            </Link>
        </div> */}

        {/* <div className="flex items-center space-x-3 mt-8 mr-12">
  <Link
    href="/blogs"
    className="px-4 py-2 text-sm font-medium
                text-gray-800 dark:text-white
                bg-white/20 dark:bg-black/10
                rounded-2xl shadow-md shadow-[#1F2BF3]/20
                transition-all duration-200
                hover:bg-gradient-to-r hover:from-[#1F2BF3] hover:to-[#00D8C0]
                hover:brightness-110 hover:scale-95
                cursor-pointer text-center"
  >
    Voir tous les blogs
  </Link>
</div> */}

<div className="flex justify-center mt-10">
  <Link
    href="/blogs"
    className="px-24 py-4 text-sm font-medium
               text-gray-800 dark:text-white
               bg-white/20 dark:bg-black/10
               rounded-2xl shadow-md shadow-[#1F2BF3]/20
               transition-all duration-200
               hover:bg-gradient-to-r hover:from-[#1F2BF3] hover:to-[#00D8C0]
               hover:brightness-110 hover:scale-105
               cursor-pointer text-center"
  >
    See All blogs
  </Link>
</div>






    </section>


    {/* <div className="mb-6">
      <Link
        href={route('blogs.create')} // route vers le formulaire Create
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Créer un Blog
      </Link>
    </div> */}
            </div>
            </div>

        </MainLayout>
);
}
        
            

            
           

            

            
            
        
    

// Sample data (you would replace with your actual data)
const services = [
    {
        title: "Web Development",
        description: "Custom websites and web applications tailored to your business needs.",
        icon: (props) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        title: "Mobile Apps",
        description: "iOS and Android applications that engage your customers.",
        icon: (props) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        title: "UI/UX Design",
        description: "Beautiful, intuitive interfaces that enhance user experience.",
        icon: (props) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        )
    }
];

const portfolioItems = [
    {
        title: "E-commerce Platform",
        category: "Web Development",
        image: "/images/portfolio/ecommerce.jpg"
    },
    {
        title: "Mobile Banking App",
        category: "Mobile Development",
        image: "/images/portfolio/banking-app.jpg"
    },
    {
        title: "Corporate Website",
        category: "Web Design",
        image: "/images/portfolio/corporate.jpg"
    }
];

const testimonials = [
    {
        name: "Ahmed Benali",
        position: "CEO, Retail Company",
        quote: "TechWeb transformed our online presence and increased our sales by 200% within 6 months.",
        avatar: "/images/testimonials/ahmed.jpg"
    },
    {
        name: "Fatima Zahra",
        position: "Marketing Director",
        quote: "The mobile app they developed for us has been a game-changer for customer engagement.",
        avatar: "/images/testimonials/fatima.jpg"
    },
    {
        name: "Karim Oulad",
        position: "Startup Founder",
        quote: "Professional, creative, and delivered beyond our expectations. Highly recommended!",
        avatar: "/images/testimonials/karim.jpg"
    }
];
