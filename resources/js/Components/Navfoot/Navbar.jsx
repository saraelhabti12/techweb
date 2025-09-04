import { Link } from '@inertiajs/react';
import DarkModeToggle from '../DarkModeToggle';

export default function Navbar() {
    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
                <div className="max-w-full mx-auto px-4">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <img
                                className="h-16 w-auto"
                                src="/images/logo.png"
                                alt="TechWeb"
                            />
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8 ">
                        <Link href="/" className="text-gray-900 dark:text-white hover:text-[#6600CC] dark:hover:text-[#6600CC] font-medium hover:text-[#6600CC]">
                            Home
                        </Link>
                        <Link href={route('AboutUs')} className="text-gray-900 dark:text-white hover:text-[#6600CC] dark:hover:text-[#6600CC] font-medium hover:text-[#6600CC]">
                            About Us
                        </Link>
                        <Link href={route('Services')} className="text-gray-900 dark:text-white hover:text-[#6600CC] dark:hover:text-[#6600CC] font-medium hover:text-[#6600CC]">
                            Services
                        </Link>
                        <Link href={route('Projects')} className="text-gray-900 dark:text-white hover:text-[#6600CC] dark:hover:text-[#6600CC] font-medium hover:text-[#6600CC]">
                            Projects
                        </Link>
                        <Link href={route('ContactUs')} className="text-gray-900 dark:text-white hover:text-[#6600CC] dark:hover:text-[#6600CC] font-medium hover:text-[#6600CC]">
                            Contact Us
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('login')}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#8000FF] hover:bg-[#6600CC]"
                        >
                            Login
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#8000FF] hover:bg-[#6600CC]"
                        >
                            Register
                        </Link>
                        <Link
                            href="/autre-page"
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#8000FF] hover:bg-[#6600CC] "
                        >
                            ESTIMATE YOUR PROJECT
                        </Link>
                        <DarkModeToggle />

                    </div>
                </div>
            </div>
        </header>
    );
}