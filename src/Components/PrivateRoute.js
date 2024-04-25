import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PocketBaseContext from "./PocketBaseContext";

export function PrivateRoute({ element }) {
    const pb = useContext(PocketBaseContext);
    const isAuthenticated = pb.authStore.isValid;
    return isAuthenticated ? element : <Navigate to="/login" />;
}