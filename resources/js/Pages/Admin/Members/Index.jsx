import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Trash2, Edit, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
        await fetch(`/members/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
        });
        window.location.href = '/members';
    } catch (error) {
        console.error('Failed to delete member:', error);
    }
};

export default function MembersIndex({ members, auth, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('members.index'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('members.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout auth={auth} header="Members Management">
            <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="mb-6">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-purple-600">All Members</h2>
                <Link
                    href={route('members.create')}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition"
                >
                    <UserPlus size={18} />
                    Add Member
                </Link>
            </div>

            <div className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <MagnifyingGlassIcon className="h-5 w-5 text-purple-500 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search Members</h3>
                    </div>
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                <form onSubmit={handleSearch} className="flex space-x-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center space-x-2 transition duration-200"
                    >
                        <MagnifyingGlassIcon className="h-4 w-4" />
                        <span>Search</span>
                    </button>
                </form>

                {searchTerm && (
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                            <strong>Search Results for:</strong> "{searchTerm}"
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-gray-200 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                <table className="w-full border-collapse min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                        <tr >
                            <th className="px-4 py-3 text-left rounded-tl-lg">Avatar</th>
                            <th className="px-4 py-3 text-left ">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-center rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody  className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                        {members.map((member, index) => (
                            <tr
                                key={member.id}
                                className="border-b hover:bg-gray-100 transition"
                            >
                                <td className="px-4 py-3">
                                    {member.avatar ? (
                                        <img
                                            src={`/storage/${member.avatar}`}
                                            alt={member.name}
                                            className="h-10 w-10 rounded-full object-cover border border-purple-200"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full  flex items-center justify-center text-purple-600 font-bold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </td>

                                <td className="px-4 py-3 font-medium text-gray-800">{member.name}</td>
                                <td className="px-4 py-3 text-gray-900">{member.email}</td>
                                <td className="px-4 py-3 flex justify-center gap-4">
                                    <Link
                                        href={`/members/${member.id}`}
                                        className="text-purple-600 hover:text-purple-800 font-medium"
                                    >
                                        Details
                                    </Link>
                                    <Link
                                        href={`/members/${member.id}/edit`}
                                        className="text-yellow-600 hover:text-yellow-800"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </AdminLayout>
    );
}

