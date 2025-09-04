import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

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


export default function MembersIndex({ members, auth }) {
    return (
        <AdminLayout auth={auth} header="Members Management">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Members</h2>
                <Link
                    href={route('members.create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Member
                </Link>
            </div>

            <div className="bg-white shadow rounded p-4">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="py-2">{member.name}</td>
                                <td className="py-2">{member.email}</td>
                                <td className="py-2">
                                    <Link
                                        href={`/members/${member.id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Details
                                    </Link>
                                    <Link
                                        href={`/members/${member.id}/edit`}
                                        className="ml-4 text-yellow-600 hover:text-yellow-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="ml-4 text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
