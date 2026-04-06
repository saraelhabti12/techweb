import AdminLayout from '@/Layouts/AdminLayout';
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ task, auth }) {
    return (
        <AdminLayout auth={auth} header={`Task Details: ${task.title}`}>
            <div className="bg-gray-700 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 max-w-4xl mx-auto">
                <div className="mb-6">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                  </button>
                </div>

                <div className="bg-gray-100 bg-opacity-60 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 max-w-md mx-auto ">

                
                <div className="space-y-4 text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-4">{task.title}</h2>

                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-300">Description:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {task.description || "No description"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-300">Project:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {task.project?.name}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-300">Assigned To:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {task.user?.name}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-300">Status:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {task.status.replace('_', ' ')}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-300">Due Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {task.due_date || "N/A"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-300">Deadline:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {task.deadline || "N/A"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-300">Members:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {task.members.map(m => m.name).join(', ')}
                  </span>
                </p>
              </div>

                <div className="mt-6">
                    <strong className="text-lg">Files:</strong>
                    {task.files.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {task.files.map(file => (
                                <div 
                                    key={file.id} 
                                    className="border rounded-lg shadow hover:shadow-lg transition p-2 flex flex-col items-center bg-gray-50 dark:bg-gray-800"
                                >
                                    <a 
                                        href={`/storage/${file.file_path}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block w-full"
                                    >
                                        <img 
                                            src={`/storage/${file.file_path}`} 
                                            alt={file.original_name} 
                                            className="h-32 w-full object-cover rounded"
                                        />
                                    </a>                        
                                    <a 
                                        href={`/storage/${file.file_path}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="mt-2 text-sm text-purple-600 hover:underline text-center"
                                    >
                                        {file.original_name}
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="block mt-2">No files</span>
                    )}
                </div>              
            </div>
            </div>
        </AdminLayout>
    );
}

