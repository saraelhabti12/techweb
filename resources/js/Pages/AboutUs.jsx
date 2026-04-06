import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination , Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-creative";  
import { motion } from "framer-motion";
import { EffectCreative } from "swiper/modules";
import { useState, useRef,useEffect  } from "react";
import { useForm } from '@inertiajs/react';
import { Star, ChevronLeft, ChevronRight } from "lucide-react";


export default function About() {

    const images = [
    "/images/project2.jpg",
    "/images/weare2.jpg",
    "/images/weare2.jpg",
    "/images/project2.jpg",
    "/images/project2.jpg",
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);


      const [serviceOffset, setServiceOffset] = useState(0);
      const serviceRef = useRef(null);

        useEffect(() => {
          const handleScrollService = () => {
              if (serviceRef.current) {
              const rect = serviceRef.current.getBoundingClientRect();
              const windowHeight = window.innerHeight;
  
              if (rect.top < windowHeight && rect.bottom > 0) {
                  setServiceOffset((window.scrollY - rect.top) * -0.2);
                  }
                  }
              };

              window.addEventListener("scroll", handleScrollService);
              return () => window.removeEventListener("scroll", handleScrollService);
              }, []);


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

        const [reviewOffset, setReviewOffset] = useState(0);
        const reviewRef = useRef(null);

        // useEffect(() => {
        // const handleScrollReview = () => {
        //     if (reviewRef.current) {
        //     const rect = reviewRef.current.getBoundingClientRect();
        //     const windowHeight = window.innerHeight;

        //     if (rect.top < windowHeight && rect.bottom > 0) {
        //         // setReviewOffset((window.scrollY - rect.top) * -0.2);
        //         setReviewOffset(windowHeight - rect.top);
        //     }
        //     }
        // };

        // window.addEventListener("scroll", handleScrollReview);
        // return () => window.removeEventListener("scroll", handleScrollReview);
        // }, []);


        useEffect(() => {
            const handleScrollReview = () => {
                if (reviewRef.current) {
                    const rect = reviewRef.current.getBoundingClientRect();
                    // rect.top est la distance du top de la section au viewport
                    const offset = Math.max(0, window.innerHeight - rect.top); // combien la section est visible
                    setReviewOffset(offset);
                }
            };

            window.addEventListener("scroll", handleScrollReview);
            handleScrollReview(); // pour initialiser au premier rendu
            return () => window.removeEventListener("scroll", handleScrollReview);
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


    return (
        <MainLayout>

            <Head title="Innovative Web Design & Development Solutions" />
            
            <div className="min-h-screen bg-white dark:bg-black">
         
        <section className="max-w-6xl mx-auto py-32 px-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="rounded-lg overflow-hidden shadow-lg max-w-md mt-16">
                  <img
                    src="/images/bgwelcome3.jpg"
                    alt="Mission"
                    className="w-full h-full object-cover object-top translate-y-[-70px]"
                  />
                </div>
                <div className="mt-12">
                    <h2
                      className="text-6xl font-bold mb-8 
                                bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                                bg-clip-text text-transparent"
                    >
                      Better Design For Your Digital Products
                    </h2>

                    <p className="text-gray-900 dark:text-gray-300 mb-6">
                        6+ Years of experience with years of experience in the digital marketing
                        industry,TechWeb Marketing Agency has been at the forefront of delevering exceptional marketing solutions.Our seasoned 
                        team of experts leverages  cutting-edge technology and Provenstrategies to handleScrollApproachbusinesses thrive online.Trust
                        in our expertise to elevate your brand and achieve remarkable 
                        results.
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                        <img 
                            src="/images/fav1.png" 
                            alt="Company Logo" 
                            className="w-12 h-12 rounded-full"
                        />
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Jacob Jones ,CEO ,Founder
                        </span>
                    </div>

                    {/* <div className="inline-block bg-[#8000FF] text-white px-5 py-2  shadow-md">
                        EXPLORE
                    </div> */}
                </div>
            </div>
        </section>

         <section className="max-w-6xl mx-auto py-2 dark:bg-black px-6">
          <div className="text-center mb-24">
            {/* <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Our Projects
            </h2> */}
            <h2
              className="text-9xl font-bold mb-8
                          leading-[1.5] 
                          bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                          bg-clip-text text-transparent"
            >
              Our Projects
            </h2>

            <p className="text-black dark:text-gray-100 max-w-2xl mx-auto text-2xl">
              Projects We Provide
            </p>
          </div>

          <div className="flex gap-8 justify-center">
            <div className="flex flex-col justify-center items-end pr-6 gap-6">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  className={`flex items-center gap-3 transition-colors duration-300 ${
                    activeIndex === i ? "text-blue-600" : "text-white"
                  }`}
                >
                  <span
                    className={`block h-[2px] rounded transition-all duration-300 ${
                      activeIndex === i
                        ? "w-9 bg-[#1F2BF3]"
                        : "w-6 bg-gray-300"
                    }`}
                  />
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
            <Swiper
              modules={[Autoplay, EffectCreative]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              speed={2000}
              grabCursor={true}
              effect="creative"
              creativeEffect={{
                prev: { translate: ["-120%", 0, -500], opacity: 0.4 },
                next: { translate: ["120%", 0, -500], opacity: 0.4 },
              }}
              slidesPerView={1}
              className="w-full max-w-[800px] aspect-[4/3] shadow-2xl"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {images.map((src, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <img
                      src={src}
                      alt={`Slide ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
    </section>

        <section ref={serviceRef}
          className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center">
             <h1
    style={{
      transform: `translateX(${serviceOffset + 200}px)`,
      background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
    className="text-[6rem] font-extrabold tracking-wide transition-transform duration-100"
  >
    OUR SERVICES
  </h1>
        </section>
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-32">
            <div className="max-w-7xl mx-auto px-8">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 blur-xl opacity-50" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-40 min-h-[650px] grid grid-cols-1 md:grid-cols-2 gap-24 items-center border border-gray-200 dark:border-gray-700 hover:scale-[1.01] transition-transform duration-500">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-16">
                    <h2
                      className="text-6xl font-extrabold tracking-tight 
                                bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] 
                                bg-clip-text text-transparent -mt-48"
                    >
                      Fuel Your Businesse's Revenue Growth
                    </h2>
                    <div className="relative w-32 h-32 rounded-full shadow-lg flex items-center justify-center bg-white dark:bg-gray-800">
                      <img src="https://twemoji.maxcdn.com/v/latest/svg/1f680.svg" alt="Rocket" className="w-16 h-16" />
                    </div>

                    <div className="flex items-center">
                        {/* <div className="w-12 h-[2px] bg-[#8000FF] mr-4"></div> */}
                        <div className="w-24 h-[2px] bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] mr-4"></div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                          Why Techweb
                        </h2>
                  </div>
                        <div className="grid grid-cols-2 gap-x-20 gap-y-24 w-full max-w-lg">
                          <div className="relative flex items-center justify-center">
                    <span className="text-[130px] font-extrabold text-gray-300 dark:text-gray-600 select-none">
                      07
                    </span>
                    <span className="absolute text-xl font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      Years Of Experience
                    </span>
                  </div>

                <div className="relative flex flex-col items-center justify-center">
                  <span className="text-[130px] font-extrabold text-gray-300 dark:text-gray-600 absolute select-none">
                    70
                  </span>
                  <span className="relative text-xl font-semibold text-gray-900 dark:text-white">
                    Projects
                  </span>
                </div>

                <div className="relative flex flex-col items-center justify-center">
                  <span className="text-[130px] font-extrabold text-gray-300 dark:text-gray-600 absolute select-none">
                    92
                  </span>
                  <span className="relative text-xl font-semibold text-gray-900 dark:text-white">
                    Clients
                  </span>
                </div>

                <div className="relative flex flex-col items-center justify-center">
                  <span className="text-[130px] font-extrabold text-gray-300 dark:text-gray-600 absolute select-none">
                  60
                  </span>
                  <span className="relative text-xl font-semibold text-gray-900 dark:text-white">
                    Awards
                  </span>
                </div>
              </div>
            </div>

                <div className="flex flex-col items-center md:items-start gap-12">
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-lg">
                    Discover Our Showcase of Featured Works and Popular Projects drive into our portfolio to witness the creativity and expertise that define our digital solutions.
                    Each project highlights our commitment to excellence and our ability to deliver outstanding results tailored to our clients needs.Join our satisfied
                    clients and leverage our digital transformation expertise to elevate your business to new heights.
                  </p>
                  <div className="rounded-lg overflow-hidden shadow-lg max-w-md mt-16">
                    <img
                      src="/images/bgwelcome3.jpg"
                      alt="Mission"
                      className="w-full h-full object-cover object-top translate-y-[-60px]"
                    />
                  </div>
                </div>
                </div>
              </div>
            </div>
          </section>

            <section
              ref={contactRef}
              className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center"
            >
              <h1
                style={{
                  transform: `translateX(${contactOffset + 500}px)`,
                  background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="text-[8rem] font-extrabold tracking-wide transition-transform duration-100"
              >
                Contact
              </h1>
            </section>


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

      {/* <section ref={reviewRef}
        className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center">
            <h1
            style={{ transform: `translateX(${reviewOffset + 500}px)` }}text-7xl font-extrabold mb-6 relative inline-block dark:text-white text-black
            className="text-[8rem] font-extrabold text-gray-900 dark:text-white tracking-wide transition-transform duration-100"
            >
            Review
            </h1>
      </section> */}
      <section
            ref={reviewRef}
            className="relative bg-white dark:bg-black py-32 overflow-hidden flex items-center justify-center"
        >
            <h1
                style={{
                    transform: `translateX(${reviewOffset * 0.2}px) translateY(-50px)`,
                    background: "linear-gradient(to right, #1F2BF3, #00D8C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
                className="text-[8rem] font-extrabold tracking-wide transition-transform duration-100"
            >
                Reviews
            </h1>
        </section>
      
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
            </div>
        </MainLayout>
    );
}