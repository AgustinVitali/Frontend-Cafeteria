import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { User, UserRole } from "../types";

// Modo de prueba - cambiar para simular diferentes roles
const TEST_MODE = true;
const TEST_ROLE: UserRole = "cliente"; // 'admin' | 'barista' | 'cliente'

export const useAuth = () => {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      // En modo de prueba, usar rol fijo
      if (TEST_MODE) {
        setUser({
          id: auth0User.sub || "",
          email: auth0User.email || "",
          name: auth0User.name || "",
          roles: [TEST_ROLE],
        });
      } else {
        // Extraer roles del token o namespace personalizado
        const roles = auth0User["https://cafeteria.com/roles"] || ["cliente"];

        setUser({
          id: auth0User.sub || "",
          email: auth0User.email || "",
          name: auth0User.name || "",
          roles: roles,
        });
      }
    } else {
      setUser(null);
    }
  }, [isAuthenticated, auth0User]);

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) || false;
  };

  const login = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const getAccessToken = async (): Promise<string> => {
    return await getAccessTokenSilently();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    login,
    logout: handleLogout,
    getAccessToken,
  };
};
