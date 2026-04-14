import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function ProgressUpdatesCreate({ auth, tasks }) {
    const { data, setData, post, processing, errors } = useForm({
        task_id: '',
        type: 'text',
        content: '',
        file: null,
        url: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('member.progress.store'), {
            forceFormData: true,
        });
    };

    return (
        <MemberLayout auth={auth}>
            <Head title="Add Progress Update" />

            <DashboardPage 
                title="Submit Work Update"
                description="Share your latest progress, files or links related to your assigned tasks."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Go Back
                    </DashboardButton>
                }
            >
                <DashboardCard className="max-w-2xl mx-auto border-transparent shadow-xl">
                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5" htmlFor="task_id">
                                Target Task
                            </label>
                            <select
                                id="task_id"
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                value={data.task_id}
                                onChange={(e) => setData('task_id', e.target.value)}
                                required
                            >
                                <option value="">Select the task you worked on</option>
                                {tasks.map((task) => (
                                    <option key={task.id} value={task.id}>
                                        {task.title}
                                    </option>
                                ))}
                            </select>
                            {errors.task_id && <p className="text-red-500 text-sm font-bold mt-1">{errors.task_id}</p>}
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Update Category
                            </label>
                            <select
                                id="type"
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <option value="text">Written Report / Note</option>
                                <option value="file">File Attachment</option>
                                <option value="link">External Resource Link</option>
                            </select>
                        </div>

                        {data.type === 'text' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <label htmlFor="content" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Update Details
                                </label>
                                <textarea
                                    id="content"
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    rows="5"
                                    placeholder="Describe what you have accomplished..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                />
                                {errors.content && <p className="text-red-500 text-sm font-bold mt-1">{errors.content}</p>}
                            </motion.div>
                        )}

                        {data.type === 'file' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <label htmlFor="file" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Upload Document / Asset
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-2.5 shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F2BF3]/10 file:text-[#1F2BF3] hover:file:bg-[#1F2BF3]/20"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                />
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Maximum file size: 10MB (JPG, PNG, PDF, ZIP)</p>
                                {errors.file && <p className="text-red-500 text-sm font-bold mt-1">{errors.file}</p>}
                            </motion.div>
                        )}

                        {data.type === 'link' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <label htmlFor="url" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Resource URL
                                </label>
                                <input
                                    type="url"
                                    id="url"
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                />
                                {errors.url && <p className="text-red-500 text-sm font-bold mt-1">{errors.url}</p>}
                            </motion.div>
                        )}

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <DashboardButton 
                                type="submit" 
                                disabled={processing} 
                                className="w-full !py-4"
                            >
                                {processing ? 'Uploading Submission...' : 'Complete Progress Update'}
                            </DashboardButton>
                        </div>
                    </form>
                </DashboardCard>
            </DashboardPage>
        </MemberLayout>
    );
}
import { motion } from 'framer-motion';
