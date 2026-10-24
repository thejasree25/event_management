import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const USER_KEY = "evently_user";

function getSavedUser() {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = (userData) => {
    if (!userData?.email) {
      throw new Error("The server did not return a valid user email.");
    }

    const normalizedUser = {
      id: userData.id ?? null,
      name: userData.name ?? "",
      email: userData.email,
      phone: userData.phone ?? "",
      role: userData.role ?? "USER",
    };

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(normalizedUser)
    );

    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("evently_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user?.email),
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}