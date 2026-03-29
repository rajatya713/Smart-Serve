import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem("token");
            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${savedToken}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setToken(savedToken);
                } else {
                    logout();
                }
            } catch {
                // Keep cached user if offline
                const cached = localStorage.getItem("user");
                if (cached) setUser(JSON.parse(cached));
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData, tokenValue) => {
        localStorage.setItem("token", tokenValue);
        localStorage.setItem(
            "user",
            JSON.stringify({
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                phone: userData.phone,
            })
        );
        setToken(tokenValue);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedData) => {
        setUser((prev) => ({ ...prev, ...updatedData }));
        const cached = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...cached, ...updatedData }));
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};