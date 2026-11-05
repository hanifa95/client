// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const uid = localStorage.getItem("uid");

//   if (!uid) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;