import { useForm, Link, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { BriefcaseIcon, ShieldCheckIcon, UserPlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ auth, projects = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        photo: null,
        status: 'active',
        commission_type: 'percentage',
        commission_value: 0,
        notes: '',
        project_ids: [],
    });

    const toggleProject = (projectId) => {
        const newIds = [...data.project_ids];
        if (newIds.includes(projectId)) {
            setData('project_ids', newIds.filter(id => id !== projectId));
        } else {
            setData('project_ids', [...newIds, projectId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.commercials.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Register Commercial" />
            <DashboardPage 
                title="Register New Commercial"
                description="Onboard a new internal or external commercial agent to track leads and commissions."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Go Back
                    </DashboardButton>
                }
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <DashboardCard className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <UserPlusIcon className="w-4 h-4 text-[#1F2BF3]" />
                                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Partner Identity</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        placeholder="Enter full name"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        placeholder="email@techweb.com"
                                    />
                                    <p className="mt-1 text-[9px] font-bold text-gray-400 uppercase">Auto-links to member account if email matches.</p>
                                    {errors.email && <p className="mt-1 text-sm text-red-500 font-bold">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Phone Number</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        placeholder="+212 ..."
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500 font-bold">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Photo</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setData('photo', e.target.files[0])}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        accept="image/*"
                                    />
                                    {errors.photo && <p className="mt-1 text-sm text-red-500 font-bold">{errors.photo}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Commission Logic</label>
                                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setData('commission_type', 'percentage')}
                                            className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                                data.commission_type === 'percentage'
                                                ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-sm'
                                                : 'text-gray-400'
                                            }`}
                                        >
                                            Percentage (%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('commission_type', 'fixed')}
                                            className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                                data.commission_type === 'fixed'
                                                ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-sm'
                                                : 'text-gray-400'
                                            }`}
                                        >
                                            Fixed Amount
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        {data.commission_type === 'percentage' ? 'Rate (%)' : 'Value (MAD)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.commission_value}
                                        onChange={(e) => setData('commission_value', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all font-bold"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Agreement Notes</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all min-h-[120px]"
                                    placeholder="Internal notes about agreement, performance, or terms..."
                                />
                            </div>
                        </DashboardCard>
                    </div>

                    <div className="space-y-6">
                        <DashboardCard title="Active Project Linking" description="Assign this commercial to specific projects.">
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {projects.map((project) => (
                                    <div 
                                        key={project.id}
                                        onClick={() => toggleProject(project.id)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                                            data.project_ids.includes(project.id)
                                            ? 'bg-[#1F2BF3]/5 border-[#1F2BF3]'
                                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h5 className={`text-xs font-black truncate ${data.project_ids.includes(project.id) ? 'text-[#1F2BF3]' : 'text-gray-900 dark:text-white'}`}>
                                                {project.name}
                                            </h5>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">{project.project_type}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            data.project_ids.includes(project.id) ? 'bg-[#1F2BF3] border-[#1F2BF3]' : 'border-gray-200'
                                        }`}>
                                            {data.project_ids.includes(project.id) && <ShieldCheckIcon className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Account Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all text-xs font-bold"
                                >
                                    <option value="active">ACTIVE</option>
                                    <option value="inactive">INACTIVE</option>
                                </select>
                            </div>
                            <DashboardButton 
                                type="submit" 
                                disabled={processing} 
                                className="w-full !py-4 shadow-xl shadow-blue-500/20"
                            >
                                Complete Registration
                            </DashboardButton>
                        </div>
                    </div>
                </form>
            </DashboardPage>
        </AdminLayout>
    );
}
