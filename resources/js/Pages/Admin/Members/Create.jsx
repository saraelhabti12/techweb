import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout'; // Assuming you're using AdminLayout for consistency

export default function Create({auth}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('members.store'), {
            onSuccess: () => {
                // Reset form after successful submission
                reset();
                // Optionally redirect after creation
                window.location.href = route('members.index'); // Or use router.visit(route('members.index')) for SPA navigation
            },
        });
    };

    return (
        <AdminLayout auth={auth} header="Members Management">
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
                                required
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
                                required
                            />
                            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create Member
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
