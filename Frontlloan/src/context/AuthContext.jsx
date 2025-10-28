import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ novo estado de carregamento

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // ✅ só termina quando já verificou o localStorage
  }, []);

  const login = (jwtToken, operador) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(operador));
    setToken(jwtToken);
    setUser(operador);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ✅ mostra uma tela de "carregando" enquanto verifica login
  if (loading) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
