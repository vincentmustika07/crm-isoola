import { Head, useForm } from '@inertiajs/react';
import { Building2, Lock, User } from 'lucide-react';
import LoginImage from '@/images/login.avif';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
                {/* Left panel */}
                <div
                    className="relative hidden flex-col justify-between bg-cover bg-center p-12 lg:flex lg:w-1/2"
                    style={{ backgroundImage: `url(${LoginImage})` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">
                            CRM Isoola
                        </span>
                    </div>

                    <p className="relative z-10 text-sm text-white">
                        © 2026 CRM Isoola. All rights reserved.
                    </p>
                </div>

                {/* Right panel */}
                <div className="flex flex-1 items-center justify-center px-6 py-12">
                    <div className="w-full max-w-sm">
                        {/* Mobile brand */}
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-base font-bold text-gray-900">
                                CRM Isoola
                            </span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Welcome back
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Sign in to your account to continue
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData('username', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Enter your username"
                                        autoFocus
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-60"
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
