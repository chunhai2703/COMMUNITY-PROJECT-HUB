import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestAuth({ children }) {
    const { isAuthenticated, user } = useAuth();
    if (isAuthenticated) {
        if (user && user?.roleId === 1) {
            return <Navigate to="/home-student" />;
        } else if (user && (user?.roleId === 2)) {
            return <Navigate to="/home-lecturer" />;
        } else if (user && (user?.roleId === 3)) {
            return <Navigate to="/home-trainee" />;
        } else if (user && (user?.roleId === 4)) {
            return <Navigate to="/home-department-head" />;
        } else if (user && (user?.roleId === 5)) {
            return <Navigate to="/home-business-relation" />;
        } else if (user && (user?.roleId === 6)) {
            return <Navigate to="/home-business-relation" />;
        } else if (user && (user?.roleId === 7)) {
            return <Navigate to="/home-admin" />;
        }
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}