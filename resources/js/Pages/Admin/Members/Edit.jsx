import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ArrowLeft } from 'lucide-react';

const Edit = ({ member, auth }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: member.name || '',
    email: member.email || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('members.update', member.id), {
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout auth={auth} header="Members Management">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 shadow">
          
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Edit Member
            </h1>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-3">
              {member.avatar ? (
                <img
                  src={`/storage/${member.avatar}`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-purple-200 w-full h-full flex items-center justify-center text-purple-700 text-3xl font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-center text-purple-600 dark:text-purple-400">
              Edit {member.name}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-300 shadow-sm 
                           focus:border-purple-500 focus:ring-purple-500"
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-300 shadow-sm 
                           focus:border-purple-500 focus:ring-purple-500"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-300 shadow-sm 
                           focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 
                           dark:bg-gray-700 dark:text-gray-300 shadow-sm 
                           focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.password_confirmation && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>}
            </div>

            <div className="flex justify-center mt-6">
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
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Edit;



