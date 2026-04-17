import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import DashboardButton from '@/Components/UI/DashboardButton';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('admin.profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";
    const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all";

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DashboardButton variant="danger" onClick={confirmUserDeletion}>
                Delete Account
            </DashboardButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-white dark:bg-gray-900 rounded-[2rem]">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                        Are you sure?
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div>
                        <label
                            htmlFor="password"
                            className={labelClass}
                        >
                            Confirm Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={inputClass}
                            placeholder="Your password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <DashboardButton variant="secondary" onClick={closeModal}>
                            Cancel
                        </DashboardButton>

                        <DashboardButton variant="danger" type="submit" disabled={processing}>
                            Permanently Delete
                        </DashboardButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
