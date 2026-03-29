import { useEffect } from "react";

const Notification = ({ message, type = "success", onClose, duration = 4000 }) => {
    useEffect(() => {
        if (message && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    const colors = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
        warning: "bg-yellow-600",
    };

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-white 
        text-sm rounded-lg shadow-lg fade-in ${colors[type] || colors.info}`}
        >
            {message}
        </div>
    );
};

export default Notification;