import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, roles }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) return <LoadingSpinner />;

    if (!token) {
        return <Navigate to="/customer/login" state={{ from: location }} replace />;
    }

    if (roles && user && !roles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboards = {
            customer: "/customer/dashboard",
            agency: "/agency/dashboard",
            delivery: "/delivery/dashboard",
            admin: "/admin/dashboard",
        };
        return <Navigate to={dashboards[user.role] || "/"} replace />;
    }

    return children;
};

export default ProtectedRoute;