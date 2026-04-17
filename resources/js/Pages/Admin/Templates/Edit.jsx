import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, Link, router } from "@inertiajs/react";
import { ArrowLeftIcon, TagIcon, DocumentTextIcon, FolderIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import DashboardPage from "@/Components/UI/DashboardPage";
import DashboardCard from "@/Components/UI/DashboardCard";
import DashboardButton from "@/Components/UI/DashboardButton";
import DashboardInput from "@/Components/UI/DashboardInput";

export default function Edit({ template, auth }) {
  const { data, setData, put, processing, errors } = useForm({
    title: template.title,
    category: template.category,
    description: template.description,
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.templates.update", template.id));
  };

  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";
  const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all";

  return (
    <AdminLayout auth={auth}>
      <DashboardPage 
        title="Edit Template" 
        description={`Modify the properties of template: ${template.title}`}
        actions={
          <DashboardButton 
            variant="secondary" 
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </DashboardButton>
        }
      >
        <div className="max-w-2xl mx-auto">
          <DashboardCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              <DashboardInput
                label="Title"
                type="text"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                icon={DocumentTextIcon}
                placeholder="Template Title"
              />
              {errors.title && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.title}</p>}

              <DashboardInput
                label="Category"
                type="text"
                value={data.category}
                onChange={(e) => setData("category", e.target.value)}
                icon={FolderIcon}
                placeholder="Template Category"
              />
              {errors.category && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.category}</p>}

              <div className="space-y-1.5">
                <label className={labelClass}>Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  rows={6}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe the template..."
                />
                {errors.description && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.description}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Template File</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors">
                    <PaperClipIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="file"
                    onChange={(e) => setData("image", e.target.files[0])}
                    className={`${inputClass} pl-11 pt-[11px]`}
                  />
                </div>
                {errors.image && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.image}</p>}
              </div>

              <div className="flex gap-4 pt-6">
                <DashboardButton
                  type="submit"
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? 'Updating...' : 'Update Template'}
                </DashboardButton>
                <Link href={route("admin.templates.index")} className="flex-1">
                  <DashboardButton
                    variant="secondary"
                    className="w-full"
                  >
                    Cancel
                  </DashboardButton>
                </Link>
              </div>
            </form>
          </DashboardCard>
        </div>
      </DashboardPage>
    </AdminLayout>
  );
}

