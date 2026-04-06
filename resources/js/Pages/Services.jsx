import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Services() {

            const services = [
            {
            title: "Web Development",
            p1: "We build modern, scalable websites.",
            p2: "Custom solutions tailored to your brand.",
            },
            {
            title: "E-commerce",
            p1: "Launch powerful online stores.",
            p2: "Secure payments and easy management.",
            },
            {
            title: "SEO & Marketing",
            p1: "Boost your visibility on search engines.",
            p2: "Targeted strategies for growth.",
            },
            {
            title: "Graphic Design",
            p1: "Creative visuals that stand out.",
            p2: "Logos, branding, and more.",
            },
            {
            title: "Advertising",
            p1: "Reach your audience effectively.",
            p2: "Data-driven ad campaigns.",
            },
        ];

    return (
        <MainLayout>

            <Head title="Services" />

            <div className="max-w-4xl mx-auto py-12 px-6">
                 <section className="py-20 bg-gray-50 dark:bg-gray-900">
      {/* Titre Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Our Services
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover what we can do for your business
        </p>
      </div>

      {/* 5 Colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl mx-auto px-6">
        {services.map((service, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {service.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{service.p1}</p>
            <p className="text-gray-600 dark:text-gray-300">{service.p2}</p>
          </div>
        ))}
      </div>
    </section>
            </div>
        </MainLayout>
    );
}