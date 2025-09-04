import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef , useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function HomePage() {

    // const { scrollY } = useScroll();
    // const x = useTransform(scrollY, [0, 500], [0, -150]); 
    // de 0 à 500px de scroll → décalage horizontal de 0 à -150px

        // Tableau de slides
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

            // State du slide actif
            const [current, setCurrent] = useState(0);

            // Fonctions navigation
            const prevSlide = () => {
            setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
            };
            const nextSlide = () => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            };




        // State + effet pour ABOUT US

        const [aboutOffset, setAboutOffset] = useState(0);
        useEffect(() => {
            const handleScrollAbout = () => {
            // Chaque pixel de scroll fait bouger About Us horizontalement
            setAboutOffset(window.scrollY * -0.3); 
            // 👉 le "-0.3" règle la vitesse (tu peux changer pour -0.5 ou -0.1)
            };

            window.addEventListener("scroll", handleScrollAbout);
            return () => window.removeEventListener("scroll", handleScrollAbout);
        }, []);

           // State + effet pour APPROACH

            const [approachOffset, setApproachOffset] = useState(0);
            const approachRef = useRef(null);

            useEffect(() => {
            const handleScrollApproach = () => {
                if (approachRef.current) {
                const rect = approachRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Vérifie que la section est visible à l'écran
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // Décale le texte proportionnellement à la position
                    setApproachOffset((window.scrollY - rect.top) * -0.2);
                }
                }
            };

            window.addEventListener("scroll", handleScrollApproach);
            return () => window.removeEventListener("scroll", handleScrollApproach);
            }, []);


            // pour les cartes de slide up

            const [selectedCategory, setSelectedCategory] = useState("All");
            const projects = [
                { id: 1, category: "Showcase Site", title: "Portfolio Vitrine", description: "Un site vitrine élégant et moderne.", image: "/images/pro1.jpg" },
                { id: 2, category: "Application Web", title: "App SaaS", description: "Une application web performante.", image: "/images/pro2.jpg" },
                { id: 3, category: "E-commerce Site", title: "Boutique en ligne", description: "Un site e-commerce optimisé.", image: "/images/weare1.jpg" },
                { id: 4, category: "Custom Website", title: "Site sur-mesure", description: "Un site web personnalisé unique.", image: "/images/weare2.jpg" },
                { id: 5, category: "Showcase Site", title: "Landing Page", description: "Une landing page claire et efficace.", image: "/images/weare3.jpg" },
                { id: 6, category: "Application Web", title: "Dashboard", description: "Un tableau de bord interactif.", image: "/images/weare4.jpg" },
                { id: 7, category: "E-commerce Site", title: "Marketplace", description: "Un site marketplace multi-vendeurs.", image: "/images/weare5.jpg" },
            ];

            const categories = ["All", "Showcase Site", "Application Web", "E-commerce Site", "Custom Website"];

            const filteredProjects =
                selectedCategory === "All"
                ? projects
                : projects.filter((p) => p.category === selectedCategory);


      return (
        <MainLayout>

            <Head title="Digital Marketing Agency Morocco | Web,SEO & Design" />

            <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Navigation Bar */}
            {/* <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0">
                                <img
                                    className="h-64 w-auto"
                                    src="/images/logo.png"
                                    alt="TechWeb"
                                />
                            </Link>
                        </div>
                       
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('login')}
                               className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#cc00ff] hover:bg-[#a000d0]"

                            >
                                Login
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('register')}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#cc00ff] hover:bg-[#a000d0]"
                            >
                                register
                            </Link>
                        </div>
                    </div>
                </div>
            </header> */}

            {/* section 1 */}
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                    {/* Image à gauche */}
                    <div className="w-full flex justify-center">
                        <img src="images/imghome.jpg" alt="imagehome" className="w-full max-w-[1200px] rounded-lg shadow-md" />
                    </div>

                    {/* Texte à droite */}
                   <div className="flex flex-col items-start" >
                    {/* Titre en haut à gauche, très grand */}
                        <h1 className="text-10xl md:text-7xl font-extrabold text-gray-900 leading-tight">Creative process in our agency</h1>
                        <p className="mt-4 flex items-center gap-2 text-sm">
                        <img src="images/image1.png" alt="icon" className="w-4 h-4" />
                            Connected Creativity
                        </p>
                        <p className="mt-6 bg-[#8000FF]  text-white text-5xl font-extrabold px-20 py-12 rounded-2xl  shadow-shadow-2xl">TECHWEB</p>
                        </div>
                    </div>
            </section>

            {/* Section 2 */}
            <section className="relative bg-gradient-to-r from-gray-100 to-gray-300 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white py-20">
                <div className="w-full px-4 sm:px-6 lg:px-8">
    <               div className="w-full">
                    
                    {/* Titre avec image alignée */}
                    <h1 className="flex items-center gap-3 font-quicksand text-5xl font-bold mb-8">
                        <img src="images/image7.png" alt="image7" className="w-12 h-12 object-contain" />
                        Drive Growth With A Top-Tier Digital Marketing Agency
                    </h1>

                    {/* Paragraphe avec espace au-dessus */}
                    <p className="font-quicksand text-xl leading-relaxed">
                        Looking to take your brand to the next level ? Our digital marketing agency offers powerful,
                        results-driven solutions to boost your online presence, increase traffic, and drive real growth.
                        From SEO and paid advertising to web development and content creation, we help businesses thrive 
                        in the digital world with tailored strategies and measurable results.
                    </p>

                    </div>
                </div>
            </section>

             {/* Section About Us */}
            <section className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center">
                <h1
                style={{ transform: `translateX(${aboutOffset + 200}px)` }}
                className="text-[8rem] font-extrabold text-gray-900 dark:text-white tracking-wide transition-transform duration-100"
                >
                About Us
                </h1>
            </section>


            {/* section who we are */}

            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-0">
    
                {/* Ligne 1 : Texte + Image */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Who We Are
                </h2>
                <p><img  />Business Innovation</p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    TechWeb :Your full-service digital marketing agency 
                    specializing in results-driven web design,e-commerce solutions,
                    and strategic online growth.
                </p>
                </div>
                <div>
                    <img
                    src="images/weare1.jpg"
                    alt="Digital Strategy"
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                    />
                    <Link href="/explore" className="text-xl font-bold text-blue-600 hover:underline">
                     EXPLORE
                   </Link>
                </div>
                </div>

                {/* Ligne 2 : Image + Texte */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                <img
                    src="images/weare2.jpg"
                    alt="Creative Solutions"
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                />
                
                </div>
                <div  className="mt-0 -mt-4">
                <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    <img src=''/>
                    Search Engine Optimization 
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Increase your online visiblity and attract more traffic with our
                    comprehensive SEO strategies. We optimize your search rankings and enhance your digital presence
                    ensuring you reach and engage your target audience effectively.
                </p>
                </div>
                </div>

                </div>
            </section>


            {/* Section full services digital marketing  */}

            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-6">
      
            {/* Bloc 1 */}

            <Link href="/UnlockRevenue" className="block">

                <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                    <img src="images/cap2.png" alt="Logo 1" className="w-12 h-12" />
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        Full-Service Digital Marketing
                    </h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    Empowering businesses with cutting-edge digital solutions,
                    ensuring efficiency and growth in a fast-evolving world.
                    </p>
                </div>
            </Link>

            {/* Bloc 2 */}

            <Link href="/UnlockRevenue" className="block">
                <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                    <img src="images/logo2.png" alt="Logo 2" className="w-12 h-12" />
                    
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        Data-Driven Marketing Strategies
                    </h3>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    
                    Crafting unique strategies tailored to your goals,blending 
                    Creativity and insight to drive long-item success.
                    
                    </p>
                </div>
            </Link>

            {/* Bloc 3 */}

            <Link href="/UnlockRevenue" className="block">
            <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                <img src="images/logo3.png" alt="Logo 3" className="w-12 h-12" />
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    Performance-Focused Campaign Management
                </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                From idea to execution ,we ensure seamless implementation 
                and continuous improvement for lasting impact.
                </p>
            </div>
            </Link>

            </div>
        </div>
        </section>


             {/* Section news ticker */}

             <section className="bg-gray-100 dark:bg-gray-900 py-4 overflow-hidden">
                    <div className="flex whitespace-nowrap">
                        {/* Bloc répété 2 fois pour effet continu */}
                        <div className="flex items-center text-xl font-bold text-gray-800 dark:text-white animate-marquee">
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Website</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Brand communication</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Vedio Editing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Advertissing & Ads </span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Video Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Website Design</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Vedio Editing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">SEO & Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">E-Commerce Website Creation</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Graphic Design</span>

                        </div>

                        <div className="flex items-center text-xl font-bold text-gray-800 dark:text-white animate-marquee">
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Website</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Brand communication</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Vedio Editing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Advertissing & Ads </span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Digital Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Video Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Website Design</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Vedio Editing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">SEO & Marketing</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">E-Commerce Website Creation</span>
                        <span className="mx-6 inline-block w-10 h-0.5 bg-purple-600"></span>
                        <span className="px-6">Graphic Design</span>
                        </div>
                    </div>
            </section>


             {/* Section APPROACH */}

            <section ref={approachRef}
            className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center">
                <h1
                style={{ transform: `translateX(${approachOffset + 500}px)` }}
                className="text-[8rem] font-extrabold text-gray-900 dark:text-white tracking-wide transition-transform duration-100"
                >
                Approach
                </h1>
            </section>


         {/* section digital marketing agency services*/}

            <section className="py-17 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                {/* Titre principal */}
                <div className="container mx-auto text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Digital Marketing Agency Services
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
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
                    <span className="absolute -top-40 left-0 text-gray-900 dark:text-gray-100 text-[250px] font-bold opacity-20">
                        {slides[current].id}
                    </span>

                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative">
                        {slides[current].title}
                    </h3>
                    <h4 className="text-gray-900 dark:text-white">
                        {slides[current].subtitle}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 relative">
                        {slides[current].text}
                    </p>
                    </div>
                </div>

                {/* Boutons navigation */}
                <div className="mt-8 -mb-6 flex justify-center gap-6">
                    <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                    >
                    <ChevronLeft size={24} />
                    </button>
                    <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                    >
                    <ChevronRight size={24} />
                    </button>
                </div>
            </section>






        {/* our projects*/}

            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                {/* Titre */}
                <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                   Our Projects
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    
                </p>
                </div>

                {/* Boutons */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                {categories.map((cat) => (
                    <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full font-medium transition ${
                        selectedCategory === cat
                        ? "bg-[#8000FF] text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    >
                    {cat}
                    </button>
                ))}
                </div>

                {/* Cartes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {filteredProjects.map((project) => (
                    <div
                    key={project.id}
                    className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden w-[350px] h-[400px] mx-auto group"
                    >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center 
                                    transition-transform duration-700 ease-in-out group-hover:-translate-y-10">
                        <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-2/3 object-cover"
                        />
                        <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {project.description}
                        </p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-20 bg-teal-600 dark:bg-teal-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">Let's discuss how we can help you achieve your digital goals and take your business to the next level.</p>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white text-teal-600 font-bold rounded-md hover:bg-gray-100 inline-block"
                    >
                        Get a Free Consultation
                    </Link>
                </div>
            </section>
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
