import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
function PrivateRoute() {
  // QUESTIONS: when what is in the outlet rerenders I think this also rerenders right?
  const user = useSelector((state) => state.user.currentUser);

  return user ? <Outlet /> : <Navigate to={"/sign-in"} />;
}

export default PrivateRoute;
