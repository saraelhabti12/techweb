import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';


export default function ContactUs() {

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
    return (
        <MainLayout>

            <Head title="Contact Us" />
            <section className="py-20 bg-gray-100 dark:bg-gray-900">
                    <div className="text-center max-w-3xl mx-auto mb-16 mt-16">
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

            {/* <section className="py-20 bg-gray-100 dark:bg-gray-900">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Find Us
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                    Visit our office or get directions easily with Google Maps
                    </p>
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.123456789!2d-5.815!3d35.779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0f8f0d1234567%3A0x123456789abcdef!2sTangier%2C%20Morocco!5e0!3m2!1sen!2sma!4v1695657850000!5m2!1sen!2sma"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    </div>
                    <div className="text-center mt-8">
                    <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Tanger+Morocco"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-[#8000FF] hover:bg-[#6600CC] text-white font-semibold rounded-lg shadow-md transition"
                    >
                        Get Directions
                    </a>
                    </div>
                </div>
            </section> */}


            <section className="py-20 bg-gray-100 dark:bg-gray-900">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Find Us in Tanger
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                    Visit our office or get directions easily with Google Maps
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.123456789!2d-5.815!3d35.779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0f8f0d1234567%3A0x123456789abcdef!2sTanger%2C%20Morocco!5e0!3m2!1sfr!2sma!4v1695657850000!5m2!1sfr!2sma"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    </div>

                    <div className="text-center mt-8">
                    <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Tangier+Morocco"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 text-sm font-medium text-gray-800 dark:text-white
                                bg-white/20 dark:bg-black/10
                                rounded-2xl shadow-md shadow-[#1F2BF3]/20
                                transition-all duration-200
                                hover:bg-gradient-to-r hover:from-[#1F2BF3] hover:to-[#00D8C0]
                                hover:brightness-110 hover:scale-95 cursor-pointer text-center"
                    >
                        Get Directions
                    </a>
                    </div>
                </div>
            </section>




        </MainLayout>
    );
}