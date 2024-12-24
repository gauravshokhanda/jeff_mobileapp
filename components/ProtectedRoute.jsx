import React, { useEffect } from 'react';
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const router = useRouter();

    useEffect(() => {
        // console.log("key points", isAuthenticated, token)

        if (!isAuthenticated || !token) {
            router.replace("/SignUp/index.jsx");
        }
    }, [isAuthenticated, token]);

    if (!isAuthenticated || !token) {
        return null;
    }
    return children;
};
export default ProtectedRoute;