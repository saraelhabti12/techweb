import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Edit({ auth, creator }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        full_name: creator.full_name || '',
        display_name: creator.display_name || '',
        profile_photo: creator.profile_photo || null,
        profile_photo_upload: null,
        gallery_images: creator.gallery_images || [],
        gallery_images_upload: [],
        age: creator.age || '',
        gender: creator.gender || '',
        city: creator.city || '',
        phone: creator.phone || '',
        email: creator.email || '',
        height_cm: creator.height_cm || '',
        weight_kg: creator.weight_kg || '',
        clothing_size: creator.clothing_size || '',
        shoe_size: creator.shoe_size || '',
        languages: creator.languages || [],
        skills: creator.skills || '',
        experience_notes: creator.experience_notes || '',
        availability_status: creator.availability_status || 'available',
        daily_rate: creator.daily_rate || '',
        visible_on_homepage: !!creator.visible_on_homepage,
        active: !!creator.active,
    });

    const [profilePreview, setProfilePreview] = useState(creator.profile_photo ? `/storage/${creator.profile_photo}` : null);
    const [galleryPreviews, setGalleryPreviews] = useState(creator.gallery_images ? creator.gallery_images.map(img => `/storage/${img}`) : []);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
    const [langInput, setLangInput] = useState('');

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        setData('profile_photo_upload', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        setData('gallery_images_upload', [...data.gallery_images_upload, ...files]);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewGalleryPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeExistingGalleryImage = (index) => {
        const newImages = [...data.gallery_images];
        newImages.splice(index, 1);
        setData('gallery_images', newImages);

        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
    };

    const removeNewGalleryImage = (index) => {
        const newImages = [...data.gallery_images_upload];
        newImages.splice(index, 1);
        setData('gallery_images_upload', newImages);

        const newPreviews = [...newGalleryPreviews];
        newPreviews.splice(index, 1);
        setNewGalleryPreviews(newPreviews);
    };

    const addLanguage = () => {
        if (langInput.trim()) {
            setData('languages', [...data.languages, langInput.trim()]);
            setLangInput('');
        }
    };

    const removeLanguage = (index) => {
        const newLangs = [...data.languages];
        newLangs.splice(index, 1);
        setData('languages', newLangs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since we are uploading files, we need to use POST with _method: 'PUT'
        post(route('admin.creators.update', creator.id));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={`Edit ${creator.display_name}`} />
            <DashboardPage 
                title={`Edit Creator: ${creator.display_name}`}
                description="Update talent details and manage portfolio."
                actions={
                    <Link href={route('admin.creators.index')}>
                        <DashboardButton variant="secondary" className="flex items-center gap-2">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to List
                        </DashboardButton>
                    </Link>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Basic Info & Profile Photo */}
                        <div className="lg:col-span-1 space-y-8">
                            <DashboardCard title="Profile Photo">
                                <div className="space-y-4">
                                    <div className="aspect-[3/4] w-full bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 overflow-hidden relative group">
                                        {profilePreview ? (
                                            <img src={profilePreview} className="w-full h-full object-cover" alt="Profile Preview" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                <PhotoIcon className="w-12 h-12 mb-2" />
                                                <p className="text-xs font-medium">Click to upload</p>
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            onChange={handleProfileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />
                                    </div>
                                    {errors.profile_photo_upload && <p className="text-xs text-red-500 font-bold">{errors.profile_photo_upload}</p>}
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Status & Visibility">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Availability Status</label>
                                        <select 
                                            value={data.availability_status}
                                            onChange={e => setData('availability_status', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        >
                                            <option value="available">Available</option>
                                            <option value="busy">Busy</option>
                                            <option value="on_shoot">On Shoot</option>
                                            <option value="vacation">Vacation</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Visible on Homepage</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Featured Section</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={data.visible_on_homepage}
                                            onChange={e => setData('visible_on_homepage', e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#1F2BF3] focus:ring-[#1F2BF3]"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Active Account</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">System Access</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={data.active}
                                            onChange={e => setData('active', e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#1F2BF3] focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                </div>
                            </DashboardCard>
                        </div>

                        {/* Right Column: Details & Gallery */}
                        <div className="lg:col-span-2 space-y-8">
                            <DashboardCard title="Personal Details">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</label>
                                        <input 
                                            type="text"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                        {errors.full_name && <p className="text-xs text-red-500 font-bold">{errors.full_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Display Name</label>
                                        <input 
                                            type="text"
                                            value={data.display_name}
                                            onChange={e => setData('display_name', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                        {errors.display_name && <p className="text-xs text-red-500 font-bold">{errors.display_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Address</label>
                                        <input 
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone Number</label>
                                        <input 
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">City</label>
                                        <input 
                                            type="text"
                                            value={data.city}
                                            onChange={e => setData('city', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Age</label>
                                        <input 
                                            type="number"
                                            value={data.age}
                                            onChange={e => setData('age', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Daily Rate</label>
                                        <input 
                                            type="number"
                                            value={data.daily_rate}
                                            onChange={e => setData('daily_rate', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Gender</label>
                                        <select 
                                            value={data.gender}
                                            onChange={e => setData('gender', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                        </select>
                                    </div>
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Measurements & Specs">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Height (cm)</label>
                                        <input 
                                            type="number"
                                            value={data.height_cm}
                                            onChange={e => setData('height_cm', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Weight (kg)</label>
                                        <input 
                                            type="number"
                                            value={data.weight_kg}
                                            onChange={e => setData('weight_kg', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cloth Size</label>
                                        <input 
                                            type="text"
                                            value={data.clothing_size}
                                            onChange={e => setData('clothing_size', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Shoe Size</label>
                                        <input 
                                            type="text"
                                            value={data.shoe_size}
                                            onChange={e => setData('shoe_size', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                        />
                                    </div>
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Experience & Skills">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Languages</label>
                                        <div className="flex gap-2 mb-3">
                                            <input 
                                                type="text"
                                                value={langInput}
                                                onChange={e => setLangInput(e.target.value)}
                                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3]"
                                                placeholder="Add language..."
                                            />
                                            <button 
                                                type="button"
                                                onClick={addLanguage}
                                                className="px-6 bg-[#1F2BF3] text-white rounded-xl font-bold text-sm"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {data.languages.map((lang, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-lg text-xs font-bold flex items-center gap-2">
                                                    {lang}
                                                    <button type="button" onClick={() => removeLanguage(i)}>
                                                        <XMarkIcon className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Skills</label>
                                        <textarea 
                                            value={data.skills}
                                            onChange={e => setData('skills', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3] h-24 resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Experience Notes</label>
                                        <textarea 
                                            value={data.experience_notes}
                                            onChange={e => setData('experience_notes', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#1F2BF3] h-24 resize-none"
                                        />
                                    </div>
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Gallery Portfolio">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Existing Images */}
                                        {galleryPreviews.map((preview, i) => (
                                            <div key={`existing-${i}`} className="aspect-square rounded-2xl overflow-hidden relative group">
                                                <img src={preview} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeExistingGalleryImage(i)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {/* New Uploads */}
                                        {newGalleryPreviews.map((preview, i) => (
                                            <div key={`new-${i}`} className="aspect-square rounded-2xl overflow-hidden relative group border-4 border-emerald-500/30">
                                                <img src={preview} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeNewGalleryImage(i)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded shadow-sm">New</div>
                                            </div>
                                        ))}
                                        <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 relative hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                                            <PlusIcon className="w-8 h-8 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Upload</p>
                                            <input 
                                                type="file" 
                                                multiple 
                                                onChange={handleGalleryUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                    {errors.gallery_images_upload && <p className="text-xs text-red-500 font-bold">{errors.gallery_images_upload}</p>}
                                </div>
                            </DashboardCard>

                            <div className="flex justify-end pt-8">
                                <DashboardButton 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-12 py-4"
                                >
                                    {processing ? 'Updating...' : 'Update Creator'}
                                </DashboardButton>
                            </div>
                        </div>
                    </div>
                </form>
            </DashboardPage>
        </AdminLayout>
    );
}
