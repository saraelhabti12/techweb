// import React, { useRef, useState } from 'react';
// import { useForm } from '@inertiajs/react';

// export default function AvatarUploader({ user }) {
//   const { data, setData, post } = useForm({ avatar: null });
// //   const [preview, setPreview] = useState(user.avatar || null);
//     const [preview, setPreview] = useState(
//     user.avatar ? `/storage/${user.avatar}` : null
//     );

//   const fileInputRef = useRef(null);

//   const handleClick = () => fileInputRef.current.click();

//   const handleChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setPreview(URL.createObjectURL(file));
//     setData('avatar', file);
//   };

//   const handleUpload = (e) => {
//     e.preventDefault();
//     // const formData = new FormData();
//     // formData.append('avatar', data.avatar);
//     // post(route('admin.members.avatar', user.id), {
//     //   forceFormData: true,
//     //   onSuccess: () => alert('Avatar updated successfully!')
//     // });

//         post(route('admin.members.avatar', user.id), {
//         forceFormData: true,
//         // onSuccess: () => {
//         //     alert('Avatar updated successfully!');
//         //     // recharge le chemin après succès
//         //     if (user.avatar) {
//         //     setPreview(`/storage/${user.avatar}`);
//         //     }
//         // },
//         onSuccess: () => router.reload(),
//         });
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div
//         onClick={handleClick}
//         className="bg-purple-200 rounded-full w-24 h-24 flex items-center justify-center text-purple-700 text-3xl font-bold shadow-lg cursor-pointer hover:opacity-80 transition"
//       >
//         {/* {preview ? (
//           <img src={preview} alt={user.name} className="rounded-full w-24 h-24 object-cover" />
//         ) : (
//           user.name.charAt(0).toUpperCase()
//         )} */}

//         {preview ? (
//         <img src={preview} alt={user.name} className="rounded-full w-24 h-24 object-cover" />
//         ) : (
//         user.avatar ? (
//             <img src={`/storage/${user.avatar}`} alt={user.name} className="rounded-full w-24 h-24 object-cover" />
//         ) : (
//             user.name.charAt(0).toUpperCase()
//         )
//         )}

//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         accept="image/*"
//         onChange={handleChange}
//       />
//       <button
//         onClick={handleUpload}
//         className="mt-2 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
//       >
//         Update Photo
//       </button>
//     </div>
//   );
// }


import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function AvatarUploader({ user }) {
  const { data, setData, post } = useForm({ avatar: null });
  const [preview, setPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current.click();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setData('avatar', file);
  };

  const handleUpload = () => {
    if (!data.avatar) return;
    post(route('admin.members.avatar', user.id), {
      forceFormData: true,
      onSuccess: () => router.reload(), // recharge la page Inertia pour afficher l'image
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="bg-purple-200 rounded-full w-24 h-24 flex items-center justify-center text-purple-700 text-3xl font-bold shadow-lg cursor-pointer hover:opacity-80 transition"
      >
        {preview ? (
          <img src={preview} alt={user.name} className="rounded-full w-24 h-24 object-cover" />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      <button
        onClick={handleUpload}
        className="mt-2 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
      >
        Update Photo
      </button>
    </div>
  );
}
