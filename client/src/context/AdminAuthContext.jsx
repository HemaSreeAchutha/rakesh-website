import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  const login = async (email, password) => {
    const res = await api.post("/admin/login", { email, password });
    localStorage.setItem("adminToken", res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, isLoggedIn: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);