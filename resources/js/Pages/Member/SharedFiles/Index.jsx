import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head } from '@inertiajs/react';
import { Download, FileText, ExternalLink } from 'lucide-react';

export default function Index({ auth, files }) {
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <MemberLayout user={auth.user}>
            <Head title="Shared Resources" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Resource Center</h1>
                        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
                            Access all files, documents, and assets shared by the administration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {files.map((file) => (
                            <div key={file.id} className="relative group bg-white dark:bg-[#0A0A0A] rounded-[3rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F2BF3]/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[#1F2BF3]/10 transition-colors" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#1F2BF3] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <a
                                            href={route('member.shared-files.download', file.id)}
                                            className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                                            title="Download Resource"
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 line-clamp-2 uppercase tracking-tight leading-tight group-hover:text-[#1F2BF3] transition-colors">
                                        {file.original_name}
                                    </h3>

                                    <div className="flex flex-col gap-2 mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{file.file_type.split('/')[1] || 'FILE'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Size</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{formatSize(file.size)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#1F2BF3] flex items-center justify-center text-[8px] font-black text-white italic">A</div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Admin Shared</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {new Date(file.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {files.length === 0 && (
                        <div className="text-center py-40 bg-gray-50 dark:bg-white/[0.02] rounded-[4rem] border border-dashed border-gray-200 dark:border-white/10">
                            <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <FileText className="w-10 h-10 text-gray-200 dark:text-white/10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Vault is Empty</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No resources have been shared with you yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
