import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { User, UserRole } from "../types";

// Modo de prueba - cambiar para simular diferentes roles
const TEST_MODE = false;
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
      console.log("auth0User:", auth0User); // <-- Para depuración de roles
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

  useEffect(() => {
    //Me da el token de Auth0
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        console.log("JWT de Auth0:", token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const hasRole = (role: UserRole): boolean => {
    return (
      user?.roles
        .map(r => r.trim().toLowerCase())
        .includes(role.toLowerCase()) || false
    );
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
