import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-bold mb-8">Welcome to the Huevero App</h1>
                
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Botón Login normal */}
                    <Link
                        href={route('login')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </Link>

                    {/* Botón Administrador */}
                    <Link
                        href={route("admin.login")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Admin Login
                    </Link>
                </div>
            </div>
        </>
    );
}
