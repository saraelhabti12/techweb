import InputError from '@/Components/InputError';
import DashboardButton from '@/Components/UI/DashboardButton';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        const updateRoute = user.role === 'admin' || user.role === 'project_manager' 
            ? route('admin.profile.update') 
            : route('member.profile.update');

        patch(updateRoute);
    };

    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";
    const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all";

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="name" className={labelClass}>Name</label>

                    <input
                        id="name"
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>Email</label>

                    <input
                        id="email"
                        type="email"
                        className={inputClass}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 rounded-md text-sm font-bold text-[#1F2BF3] hover:underline focus:outline-none"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-bold text-emerald-500">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <DashboardButton type="submit" disabled={processing}>Save</DashboardButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-500">
                            Saved successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
