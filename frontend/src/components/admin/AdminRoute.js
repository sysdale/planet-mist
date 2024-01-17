import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

const AdminRoute = () => {
  const { jwtToken, user } = useContext(AppContext);
  console.log(jwtToken, user);

  if (!jwtToken || user.username !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminRoute;
