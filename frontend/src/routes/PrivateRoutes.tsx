import { useContext, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import OrbitalSpinner from "../components/ui/LoadingSpinner";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) {
    console.error(
      "PrivateRoute: AuthContext is not available. Ensure AuthProvider wraps your application."
    );
    return <Navigate to="/auth/login" replace />;
  }

  const { user, loading } = authContext;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <OrbitalSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
