import { Head } from '@inertiajs/react';

interface ErrorPageProps {
    message: string;
    status: number;
}

export default function Error403({ message, status }: ErrorPageProps) {
    return (
        <>
            <Head title="Access Denied" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg
                                className="h-6 w-6 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Access Denied
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Error {status}
                        </p>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            {message}
                        </p>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={() => window.history.back()}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
