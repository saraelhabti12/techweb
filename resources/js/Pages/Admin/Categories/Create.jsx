import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({ name: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AdminLayout auth={auth} header="Create Category">
            <div className="max-w-xl mx-auto bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 shadow-md">
                    <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Retour
                    </button>
                    </div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
                    Add New Category
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category Name :
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-500/30 
                                       bg-gray-100 dark:bg-gray-800 dark:text-gray-100 
                                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Enter category name..."
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 rounded-lg font-semibold text-white 
                                       bg-purple-600 hover:bg-purple-700 active:bg-purple-800 
                                       focus:outline-none focus:ring-2 focus:ring-purple-400 
                                       transition disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

