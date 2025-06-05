import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  const getToken = localStorage.getItem("JWT_TOKEN") || null;
  const admin = localStorage.getItem("IS_ADMIN") === "true" || false;
  const manager = localStorage.getItem("IS_MANAGER") === "true" || false;

  const [token, setToken] = useState(getToken);
  const [isAdmin, setIsAdmin] = useState(admin);
  const [isManager, setIsManager] = useState(manager);
  const [loggedInUser, setloggedInUser] = useState(null);

  const fetchUser = async () => {
    const user = JSON.parse(localStorage.getItem("USER"));
    const jwtToken = localStorage.getItem("JWT_TOKEN");

    if (user?.fullName && jwtToken) {
      try {
        const { data } = await api.get("/api/auth/user");

        const roles = data.roles || [];

        // Set Admin flag
        if (roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("IS_ADMIN", "true");
          setIsAdmin(true);
        } else {
          localStorage.removeItem("IS_ADMIN");
          setIsAdmin(false);
        }

        // Set Manager flag
        if (roles.includes("ROLE_MANAGER")) {
          localStorage.setItem("IS_MANAGER", "true");
          setIsManager(true);
        } else {
          localStorage.removeItem("IS_MANAGER");
          setIsManager(false);
        }

        setloggedInUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);

        // Clear tokens and user state on failure
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("USER");
        localStorage.removeItem("IS_ADMIN");
        localStorage.removeItem("IS_MANAGER");

        setToken(null);
        setloggedInUser(null);
        setIsAdmin(false);
        setIsManager(false);

        toast.error("Your session has expired. Please log in to continue.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        isAdmin,
        setIsAdmin,
        isManager,
        setIsManager,
        loggedInUser,
        setloggedInUser,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(ContextApi);

  return context;
};
