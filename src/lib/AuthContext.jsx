import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);

        setUser({
          id: parsed.id || 1,
          full_name:
            parsed.full_name ||
            parsed.name ||
            parsed.email?.split("@")[0] ||
            "User",
          email: parsed.email || "",
          role: parsed.role || "patient",
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const login = (userData) => {
    const authUser = {
      id: userData.id || 1,
      full_name:
        userData.full_name ||
        userData.name ||
        userData.email?.split("@")[0] ||
        "User",
      email: userData.email || "",
      role: userData.role || "patient",
    };

    localStorage.setItem("user", JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoadingAuth: false,
        isLoadingPublicSettings: false,
        authChecked: true,
        authError: null,
        checkUserAuth: () => {},
        navigateToLogin: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);