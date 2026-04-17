import React, { useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Avatar from '@/Components/UI/Avatar';
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function UpdateProfilePhotoForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const fileInput = useRef();

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        avatar: null,
    });

    const uploadPhoto = (e) => {
        e.preventDefault();
        
        post(route('profile.avatar'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Profile Photo</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Upload a professional photo to help others recognize you.
                </p>
            </header>

            <form onSubmit={uploadPhoto} className="mt-6 space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar user={user} size="xl" className="shadow-2xl ring-4 ring-white dark:ring-gray-800" />
                    
                    <div className="flex flex-col gap-3">
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInput}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => fileInput.current.click()}
                                className="inline-flex items-center px-4 py-2 bg-[#1F2BF3] border border-transparent rounded-xl font-bold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <ArrowUpTrayIcon className="w-4 h-4" />
                                Choose Photo
                            </button>
                            
                            {data.avatar && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-[#00D8C0] border border-transparent rounded-xl font-bold text-xs text-white uppercase tracking-widest hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition ease-in-out duration-150 shadow-lg shadow-teal-500/20"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                        
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Allowed JPG, GIF or PNG. Max size of 2MB.
                        </p>
                    </div>
                </div>

                {errors.avatar && <div className="text-red-500 text-xs font-bold mt-2">{errors.avatar}</div>}
            </form>
        </section>
    );
}
