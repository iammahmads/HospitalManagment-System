import { useEffect, useState, createContext } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import validateToken from "../../services/validateToken";
import useErrorContext from "../errorContext";

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(null);
  // Renamed 'loaded' to 'isLoading' for better logic flow
  const [isLoading, setIsLoading] = useState(true); 
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const navigate = useNavigate();
  const location = useLocation(); // Useful to prevent redirects loop
  const { addError } = useErrorContext();

  const validateRoleDataRequest = async (token = cookies.token) => {
    // If no token exists, ensure we are logged out and stop loading
    if (!token) {
      setCurrentRole(null);
      setIsLoading(false);
      return null;
    }

    const { responseData, error } = await validateToken(token);

    if (error) {
      addError(error);
      setCurrentRole(null); // Clear role on error
      setIsLoading(false);
      return null;
    }

    if (!responseData.role) {
      addError(responseData.message);
      setCurrentRole(null);
      setIsLoading(false);
      return null;
    }

    setCurrentRole(responseData.role);
    setIsLoading(false);

    // Only redirect if we are NOT already on a path belonging to that role
    // This prevents the "infinite loop" flicker
    if (!window.location.pathname.startsWith(`/${responseData.role}`)) {
      navigate(`/${responseData.role}`);
    }

    return responseData.role;
  };

  // Run validation on mount (Initial Load)
  useEffect(() => {
    validateRoleDataRequest();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSetCookie = async (token) => {
    // Set the cookie
    setCookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
      path: "/",
    });
    // Immediately validate to update the UI
    await validateRoleDataRequest(token);
  };

  const handleLogout = () => {
    // 1. Clear the state IMMEDIATELY (Stops the UI from trying to fetch data)
    setCurrentRole(null);
    
    // 2. Remove the cookie properly
    removeCookie("token", { path: "/" });

    // 3. Navigate immediately (No timeout needed)
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{
        currentRole,
        validateRoleDataRequest,
        handleSetCookie,
        handleLogout,
        isLoading, // Expose this so pages can show a single loader while checking auth
      }}
    >
      {/* Optional: Don't render children until we know the auth status 
          This prevents the "login screen flash" before redirecting to dashboard */}
      {/* {isLoading ? <div>Loading App...</div> : children} */}
      
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;