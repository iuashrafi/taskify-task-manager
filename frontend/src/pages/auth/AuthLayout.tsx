import { useAuthContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <>Loading...</>;
  } else if (!loading && user) {
    return <Navigate to={"/dashboard"} />;
  }

  return <Outlet />;
};

export default AuthLayout;
