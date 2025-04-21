import { Navigate } from "react-router-dom";
import { getFirebaseAuth } from "../firebase";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = getFirebaseAuth().currentUser;
    if (user === null) {
        return <Navigate to="/login" />;
    }
    return children;
}