import { useForm, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'member',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('members.store'), {
            onSuccess: () => {
                reset();
                window.location.href = route('members.index');
            },
        });
    };

    return (
        <AdminLayout auth={auth} header="Members Management">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">

                    <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Retour
                    </button>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Member</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name :
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email :
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password :
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password :
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>}
                        </div>

                        <input type="hidden" name="role" value={data.role ? 1 : 0} />

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-16 py-3 
                                    bg-purple-600 border border-transparent rounded-md 
                                    font-semibold text-xs text-white uppercase tracking-widest 
                                    hover:bg-purple-700 active:bg-purple-900 
                                    focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                    disabled:opacity-25 transition 
                                    dark:bg-purple-700 dark:hover:bg-purple-600"
                            >
                                {processing ? 'Creating...' : 'Create Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}


