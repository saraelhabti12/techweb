import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const Show = ({ member, auth }) => {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this member?')) {
      await fetch(`/members/${member.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      }).then(() => window.location.href = '/members');
    }
  };

  return (
    <AdminLayout auth={auth} header="Member Details">
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Member Details</h2>
        <div className="space-y-4">
          <p><strong>Name:</strong> {member.name}</p>
          <p><strong>Email:</strong> {member.email}</p>
          <p><strong>Role:</strong> {member.role}</p>
          {/* Add more member details here if needed */}
        </div>
        <div className="mt-6">
          <Link
            href={`/members/${member.id}/edit`}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-4"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Show;
