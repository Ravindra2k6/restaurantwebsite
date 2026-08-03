import { createContext, useContext, useEffect, useState, useCallback } from "react";
import authService from "../services/authService";
import { setAccessToken } from "../services/api";

const AuthContext = createContext(null);

/**
 * Handles the full auth lifecycle:
 * - On mount, tries to silently restore a session via the httpOnly refresh
 *   cookie (so a page refresh doesn't log the user out).
 * - Exposes login/logout, the current user, and role-check helpers.
 * - Listens for the `auth:logout` event dispatched by the Axios interceptor
 *   (services/api.js) when a token refresh fails, so an expired session
 *   anywhere in the app cleanly redirects back to the login screen.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshRes = await authService.refresh();
        setAccessToken(refreshRes.data.accessToken);
        const meRes = await authService.getMe();
        setUser(meRes.data);
      } catch {
        clearSession();
      } finally {
        setInitializing(false);
      }
    };
    restoreSession();
  }, [clearSession]);

  useEffect(() => {
    const handleForceLogout = () => clearSession();
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, [clearSession]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  };

  const hasRole = (...roles) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initializing,
        login,
        logout,
        hasRole,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
