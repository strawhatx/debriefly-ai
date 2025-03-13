import { Outlet } from "react-router-dom";
import { useAuthGuard } from "../hooks/use-auth-guard";

const AuthGuard = () => {
  useAuthGuard(); // ✅ Simple, readable, and reusable

  return <Outlet />;
};

export default AuthGuard;
