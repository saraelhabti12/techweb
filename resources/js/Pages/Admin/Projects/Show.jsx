import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ project }) {
  return (
    <AdminLayout header={`Détails du projet: ${project.name}`}>

      <div className="w-full h-screen rounded-lg p-6 ">

        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
      
      <div className="w-full min-h-screen bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                        
      <div className="p-6 mb-6 bg-gray-100 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-30 rounded-xl shadow border border-purple-200">
        <h2 className="text-2xl font-bold mb-2 text-purple-700">{project.name}</h2>
        <p className="mb-1"><strong>Description:</strong> {project.description || '—'}</p>
        <p className="mb-1"><strong>Catégorie:</strong> {project.category?.name || '—'}</p>
        <p className="mb-1"><strong>Début:</strong> {project.start_date || '—'}</p>
        <p className="mb-1"><strong>Fin:</strong> {project.end_date || '—'}</p>
        <p className="mb-1"><strong>Status:</strong> {project.status}</p>

        <h3 className="mt-4 font-semibold text-purple-600">Membres du projet</h3>
        <ul className="list-disc list-inside">
          {project.members.map(member => (
            <li key={member.id}>{member.name} ({member.email})</li>
          ))}
        </ul>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-purple-700">Tâches du projet  :</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.tasks.map(task => (
          <div
            key={task.id}
            className="w-full min-h-[200px] bg-gray-500 bg-opacity-10 dark:bg-gray-700 dark:bg-opacity-30 
             rounded-lg p-6 mb-6 border border-purple-200 
             hover:border-purple-500 hover:bg-opacity-40
             transition duration-300 "
          >
            <div className=" flex justify-between items-center mb-3">
              <h4 className="font-semibold text-purple-700">{task.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${task.status === 'done' ? 'bg-green-200 text-green-800' :
                  task.status === 'in_progress' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'}
              `}>{task.status}</span>
            </div>

            <p className="mb-1"><strong>ID:</strong> {task.id}</p>
            <p className="mb-1"><strong>Description:</strong> {task.description || '—'}</p>
            <p className="mb-1"><strong>Deadline:</strong> {task.deadline || '—'}</p>
            <p className="mb-1"><strong>Due Date:</strong> {task.due_date || '—'}</p>
            <p className="mb-1"><strong>Assigné à:</strong> {task.user?.name || '—'}</p>
            <p className="mb-1"><strong>Membres:</strong> {task.members.map(m => m.name).join(', ') || '—'}</p>
            <p className="mb-1 text-xs text-gray-900"><strong>Créé le:</strong> {new Date(task.created_at).toLocaleString()}</p>
            <p className="mb-2 text-xs text-gray-900"><strong>Mis à jour le:</strong> {new Date(task.updated_at).toLocaleString()}</p>

            {task.files.length > 0 && (
              <div className="mt-2">
                <h5 className="font-medium text-purple-700 mb-2">Fichiers attachés :</h5>
                <div className="flex flex-wrap gap-3">
                  {task.files.map(file => {
                    const isImage = ['jpg','jpeg','png','gif','webp'].some(ext =>
                      file.original_name.toLowerCase().endsWith(ext)
                    );
                    return (
                      <div
                        key={file.id}
                        className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg shadow w-28 hover:shadow-lg transition-shadow"
                      >
                        {isImage && (
                          <img
                            src={`/storage/${file.file_path}`}
                            alt={file.original_name}
                            className="w-24 h-24 object-cover rounded mb-1"
                          />
                        )}
                        <a
                          href={`/storage/${file.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-700 hover:underline text-center text-xs break-words"
                        >
                          {file.original_name}
                        </a>
                        <span className="text-gray-500 text-xs mt-1">
                          ({new Date(file.created_at).toLocaleDateString()})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
      </div>

    </AdminLayout>
  );
}

