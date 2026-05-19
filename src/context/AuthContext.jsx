import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../database/supabaseconfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState({});
  const [cargando, setCargando] = useState(true);

  // 🔁 Recuperar sesión
  useEffect(() => {
    const user = localStorage.getItem("usuario-supabase");
    const perms = localStorage.getItem("permisos");

    if (user) setUsuario(JSON.parse(user));
    if (perms) setPermisos(JSON.parse(perms));

    setCargando(false);
  }, []);

  // 🔐 Login
  const login = async (email, pin) => {
    const { data: empleado, error } = await supabase
      .from("empleados")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error("Error al buscar empleado");
    if (!empleado) throw new Error("Empleado no existe");

    if (empleado.pin !== pin) {
      throw new Error("PIN incorrecto");
    }

    const { data: rolData } = await supabase
      .from("permisos")
      .select("permisos")
      .eq("rol", empleado.tipo_empleado)
      .maybeSingle();

    setUsuario(empleado);
    setPermisos(rolData?.permisos || {});

    localStorage.setItem("usuario-supabase", JSON.stringify(empleado));
    localStorage.setItem("permisos", JSON.stringify(rolData?.permisos || {}));
  };

  // 🔓 Logout
  const logout = () => {
    setUsuario(null);
    setPermisos({});
    localStorage.removeItem("usuario-supabase");
    localStorage.removeItem("permisos");
  };

  // 🛡️ Permisos
  const tienePermiso = (permiso) => permisos?.[permiso] === true;

  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, tienePermiso, cargando }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);