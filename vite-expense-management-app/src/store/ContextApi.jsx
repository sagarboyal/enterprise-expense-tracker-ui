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
    if (user?.fullName) {
      try {
        const { data } = await api.get("/api/auth/user");
        const roles = data.roles || [];
        if (roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("IS_ADMIN", "true");
          setIsAdmin(true);
        } else {
          localStorage.removeItem("IS_ADMIN");
          setIsAdmin(false);
        }
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
        toast.error("Failed to fetch user data.");
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
