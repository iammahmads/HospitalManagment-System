import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "./loader";
import useUserContext from "../context/userContext";

export default function ProtectedRoute({
  component: Component,
  allowedRole,
  rest,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { validateRoleDataRequest } = useUserContext();

  const validate = async () => {
    setPageLoaded(false);
    const userRrole = await validateRoleDataRequest();
    if (allowedRole == userRrole) {
      setIsAuthenticated(true);
      return;
    }
    setIsAuthenticated(false);
    setPageLoaded(true);
  };

  // console.log("isAuthenticated: ", isAuthenticated)
  // console.log("loaded: ", pageLoaded)

  useEffect(() => {
    validate();

  }, []);

  if (isAuthenticated) {
    return <Component {...rest} />; // passing already passed props if any
  } else if (pageLoaded) {
    return <Navigate to={"/"} />;
  }
  return <Loader />;
}
