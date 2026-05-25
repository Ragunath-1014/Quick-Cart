import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import Loader from "../../shared/Loader";

function AdminRoute({ children }) {

  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader loadingMessage="Welcome Admin" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;