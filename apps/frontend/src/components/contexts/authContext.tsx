import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { type User } from "../../lib/types";

type AuthContextType = {
  user: User | null;
  loaded: boolean;
  error: string | null;
  refreshUser: () => void;
  login: (email: string | null, password: string | null) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadUser() {
      await refreshUser();
      setLoaded(true);
    }

    if (!user) {
      loadUser();
    }
  }, [user]);
  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 5000);
    }
  }, [error]);

  const refreshUser = async () => {
    return fetch("/api/auth/@me", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser({
            email: data.email,
            admin: data.admin,
            name: data.name,
            uploadToken: data.uploadToken,
          });
          return true;
        } else {
          return false;
        }
      })
      .catch((e) => {
        console.error("Failed to check login status", e);
        return false;
      });
  };

  const logUserIn = async (
    email: string | null,
    password: string | null,
  ): Promise<boolean> => {
    return fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(async (res) => {
      if (res.ok) {
        const data = (await res.json()) as User;
        setUser({
          admin: data.admin,
          email: data.email,
          name: data.name,
          uploadToken: data.uploadToken,
        });
        return true;
      } else {
        setError("Failed to login");
        return false;
      }
    });
  };

  const value = useMemo(
    () => ({
      user,
      error,
      loaded,
      refreshUser,
      login: logUserIn,
      logout: () => setUser(null),
    }),
    [user, error, loaded],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthContextProvider");
  return context;
}
