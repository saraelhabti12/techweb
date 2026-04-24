import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Download, Trash2, FileText, Upload, HardDrive } from 'lucide-react';

export default function Index({ auth, files }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.shared-files.store'), {
            onSuccess: () => reset('file'),
        });
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Shared Files Management" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Shared Files</h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Upload and manage files shared with all members.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-[#1F2BF3]/10 px-4 py-2 rounded-2xl border border-[#1F2BF3]/20">
                            <HardDrive className="w-5 h-5 text-[#1F2BF3]" />
                            <span className="text-sm font-bold text-[#1F2BF3] uppercase tracking-wider">Storage System</span>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm mb-12">
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-6">
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-4 tracking-[0.2em]">Select File to Upload</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={e => setData('file', e.target.files[0])}
                                        className="w-full bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                                    />
                                    {errors.file && <div className="text-red-500 text-xs mt-1 ml-4">{errors.file}</div>}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={processing || !data.file}
                                className="px-8 py-4 bg-[#1F2BF3] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3 shadow-lg shadow-[#1F2BF3]/20"
                            >
                                <Upload className="w-4 h-4" />
                                {processing ? 'Uploading...' : 'Upload File'}
                            </button>
                        </form>
                    </div>

                    {/* Files List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {files.map((file) => (
                            <div key={file.id} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#1F2BF3] group-hover:scale-110 transition-transform">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={route('admin.shared-files.download', file.id)}
                                            className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => {
                                                if(confirm('Are you sure you want to delete this file?')) {
                                                    import('@inertiajs/react').then(({ router }) => {
                                                        router.delete(route('admin.shared-files.destroy', file.id));
                                                    });
                                                }
                                            }}
                                            className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white truncate mb-2 uppercase tracking-tight" title={file.original_name}>
                                    {file.original_name}
                                </h3>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{formatSize(file.size)}</span>
                                    <span className="text-[10px] font-black uppercase text-[#1F2BF3] tracking-widest">{new Date(file.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {files.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
                            <FileText className="w-16 h-16 text-gray-300 dark:text-white/10 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No files uploaded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
