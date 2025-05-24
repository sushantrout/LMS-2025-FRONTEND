"use client";
import { GlobalKeys } from "@/types/constants/global-keys";
import Keycloak from "keycloak-js";
import { createContext, useContext, useEffect, useState } from "react";
import { useClientIdProvider } from "./client-id-provider";
import { clearAllCookies, setCookie } from "@/util/helpers/cookie-helper";
import { useRouter } from "next/navigation";
import { getPrincipal } from "@/http/principal-service";

type AuthContextType = {
  isAuthenticated: boolean;
  keycloak: any;
  handleLogOut: () => void;
  principal: any;
};

const AuthProviderContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { clientId } = useClientIdProvider();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [principal, setPrincipal] = useState({});
  const [logo, setLogo] = useState(null);
  const [userLogo, setUserLogo] = useState(null);
  const [organizationName, setOrganizationName] = useState("");
  const [keycloak, setKeycloak] = useState<any>(null);
  const router = useRouter();
  const handleLogOut = () => {
    if (keycloak) {
      keycloak?.logout();
      setIsAuthenticated(false);
      clearAllCookies();
      router.replace("/"); // Redirect to the home page after logout
    }
  };
  useEffect(() => {
    const authenticateByKeycloak = async () => {
      const isDomain =
        process.env.NEXT_PUBLIC_ENVIRONMENT === "prod" ||
        process.env.NEXT_PUBLIC_ENVIRONMENT === "qa";
      const KEY_CLOAK_AUTH_URL = isDomain
        ? `${window.location.origin}/${process.env.NEXT_PUBLIC_KEY_CLOAK_AUTH_PATH}`
        : `${process.env.NEXT_PUBLIC_KEY_CLOAK_AUTH_URL}`;
      const kc = new Keycloak({
        realm: clientId,
        url: KEY_CLOAK_AUTH_URL,
        clientId: clientId, // dynamically
      });

      try {
        const authenticated = await kc.init({ onLoad: "login-required",checkLoginIframe: false, enableLogging: true,});
        setKeycloak(kc);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          //auth token setting
          setCookie(GlobalKeys.AUTH_COOKIE_NAME, kc.token);
          setCookie(GlobalKeys.REFRESH_COOKIE_NAME, kc.refreshToken);

          getPrincipal()
            .then((principalRes) => {
              let principal = principalRes.data;
              setPrincipal(principal);
              if (
                principal &&
                principal.organisation &&
                principal.organisation.logo
              ) {
                setLogo(principal.organisation.logo);
                setUserLogo(principal.image);
              }
              if (
                principal &&
                principal.organisation &&
                principal.organisation.name
              ) {
                setOrganizationName(principal.organisation.name);
              }
            })
            .catch((error) => {
              console.error("Error initializing Keycloak:", error);
            });
        }
      } catch (error) {
        console.error("Error initializing Keycloak:", error);
      }
    };
    if (!keycloak && clientId) {
      authenticateByKeycloak();
    }
  }, [keycloak, clientId]);

  useEffect(() => {
    if (isAuthenticated && keycloak) {
      const tokenRefreshInterval = 60 * 1000; // Refresh token every 60 seconds
      const refreshTokenIfNeeded = async () => {
        try {
          const currentTime = new Date().getTime();
          // if (currentTime > tokenExpiryTime) {
          console.log("Refreshing token...");
          const refreshed = await keycloak.updateToken(tokenRefreshInterval);
          if (refreshed) {
            /*sessionStorage.setItem('token', keycloak.token);*/
            //refresh token logic
            setCookie(GlobalKeys.AUTH_COOKIE_NAME, keycloak.token);
            setCookie(GlobalKeys.REFRESH_COOKIE_NAME, keycloak.refreshToken);
          } else {
            console.log("Access token refresh failed");
            keycloak.logout();
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      };

      const tokenRefreshTimer = setInterval(
        refreshTokenIfNeeded,
        tokenRefreshInterval
      );

      return () => {
        clearInterval(tokenRefreshTimer);
      };
    }
  }, [isAuthenticated, keycloak]);

  if (!keycloak || !isAuthenticated || Object.keys(principal).length === 0) {
    return null;
  }

  return (
    <AuthProviderContext.Provider
      value={{ isAuthenticated, keycloak, handleLogOut, principal }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
};

export const useAuthProviderContext = () => useContext(AuthProviderContext);
