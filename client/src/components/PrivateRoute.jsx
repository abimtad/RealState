import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
function PrivateRoute() {
  const user = useSelector((state) => state.user.currentUser);

  return user ? <Outlet /> : <Navigate to={"/sign-in"} />;
}

export default PrivateRoute;
