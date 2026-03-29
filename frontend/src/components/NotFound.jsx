import { Link } from "react-router-dom";

const NotFound = () => (
    <div className="min-h-screen flex flex-col items-center justify-center page-bg px-4">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            404 — Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 text-center">
            The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
            Go Home
        </Link>
    </div>
);

export default NotFound;