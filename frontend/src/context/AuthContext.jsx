import { createContext, useEffect, useState } from "react"

import api from "../api/axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data);
            }
            catch (err) {
                setUser(null);
                console.log(err.response?.data?.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    let value = {
        user, setUser, loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;