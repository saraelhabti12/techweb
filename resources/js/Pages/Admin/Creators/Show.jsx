import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { ArrowLeftIcon, PencilIcon, TrashIcon, MapPinIcon, CurrencyDollarIcon, EnvelopeIcon, PhoneIcon, CakeIcon, UserIcon, BriefcaseIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, creator }) {
    const statusColors = {
        available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        busy: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        on_shoot: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        vacation: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={`Creator: ${creator.full_name}`} />
            <DashboardPage 
                title={creator.display_name}
                description="Detailed profile and portfolio."
                actions={
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.creators.index')}>
                            <DashboardButton variant="secondary" className="flex items-center gap-2">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back
                            </DashboardButton>
                        </Link>
                        <Link href={route('admin.creators.edit', creator.id)}>
                            <DashboardButton className="flex items-center gap-2">
                                <PencilIcon className="w-4 h-4" />
                                Edit Profile
                            </DashboardButton>
                        </Link>
                    </div>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar: Photo & Key Metrics */}
                    <div className="lg:col-span-1 space-y-8">
                        <DashboardCard className="!p-0 overflow-hidden">
                            <div className="aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 relative">
                                {creator.profile_photo ? (
                                    <img src={`/storage/${creator.profile_photo}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <UserIcon className="w-20 h-20" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl ${statusColors[creator.availability_status]}`}>
                                        {creator.availability_status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</span>
                                        <span className="text-sm font-bold dark:text-white">{creator.full_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Rate</span>
                                        <span className="text-sm font-black text-[#1F2BF3]">{creator.daily_rate ? `$${creator.daily_rate} / Day` : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Gender</span>
                                        <span className="text-sm font-bold dark:text-white">{creator.gender || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">City</span>
                                        <span className="text-sm font-bold dark:text-white">{creator.city || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                    <a href={`mailto:${creator.email}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#1F2BF3] transition-colors">
                                        <EnvelopeIcon className="w-5 h-5" />
                                        {creator.email || 'No Email'}
                                    </a>
                                    <a href={`tel:${creator.phone}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#1F2BF3] transition-colors">
                                        <PhoneIcon className="w-5 h-5" />
                                        {creator.phone || 'No Phone'}
                                    </a>
                                </div>
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Measurements">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Height</p>
                                    <p className="text-xl font-black dark:text-white">{creator.height_cm || '--'} <span className="text-xs font-normal">cm</span></p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Weight</p>
                                    <p className="text-xl font-black dark:text-white">{creator.weight_kg || '--'} <span className="text-xs font-normal">kg</span></p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Clothing</p>
                                    <p className="text-xl font-black dark:text-white">{creator.clothing_size || '--'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Shoe</p>
                                    <p className="text-xl font-black dark:text-white">{creator.shoe_size || '--'}</p>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Main Content: Bio, Skills & Gallery */}
                    <div className="lg:col-span-2 space-y-8">
                        <DashboardCard title="Biography & Professional Background">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-[#1F2BF3] tracking-[0.2em]">Experience Notes</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                        {creator.experience_notes || 'No experience notes provided.'}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-[#1F2BF3] tracking-[0.2em]">Skills & Talent</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                        {creator.skills || 'No skills listed.'}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-[#1F2BF3] tracking-[0.2em]">Languages</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {creator.languages?.map((lang, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg text-xs font-bold">
                                                {lang}
                                            </span>
                                        )) || <span className="text-gray-400 italic text-sm">No languages specified.</span>}
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Portfolio Gallery">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {creator.gallery_images?.length > 0 ? (
                                    creator.gallery_images.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-2xl overflow-hidden group relative cursor-pointer shadow-lg">
                                            <img src={`/storage/${img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <EyeIcon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                        <p className="text-gray-400 italic">No gallery images uploaded.</p>
                                    </div>
                                )}
                            </div>
                        </DashboardCard>

                        <div className="flex justify-between items-center p-8 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-red-600">Danger Zone</p>
                                <p className="text-xs text-red-500/80">Deleting a creator profile is permanent and cannot be undone.</p>
                            </div>
                            <button 
                                onClick={() => confirm("Delete this profile permanentely?") && router.delete(route('admin.creators.destroy', creator.id))}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                            >
                                Delete Profile
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
