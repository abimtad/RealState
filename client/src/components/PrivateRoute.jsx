import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
function PrivateRoute() {
  // QUESTIONS:1 When what is in the outlet rerenders I think this also rerenders right?
  // QUESTIONS:2 How does the Navigate component work?

  const user = useSelector((state) => state.user.currentUser);

  return user ? <Outlet /> : <Navigate to={"/sign-in"} />;
}

export default PrivateRoute;
