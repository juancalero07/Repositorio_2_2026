import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../database/supabaseconfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState({});

  // 🔐 CARGAR SESIÓN SEGURA AL INICIAR
  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario-supabase");
      const permisosGuardados = localStorage.getItem("permisos");

      if (usuarioGuardado) {
        const usuarioParseado = JSON.parse(usuarioGuardado);
        setUsuario(usuarioParseado);
      }

      if (permisosGuardados) {
        const permisosParseados = JSON.parse(permisosGuardados);
        setPermisos(permisosParseados);
      }
    } catch (error) {
      console.warn("⚠️ Datos corruptos en localStorage, limpiando...");
      localStorage.removeItem("usuario-supabase");
      localStorage.removeItem("permisos");
    }
  }, []);

  // 🔑 LOGIN
  const login = async (email, pin) => {
    // 1. Buscar empleado
    const { data: empleado, error } = await supabase
      .from("empleados")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error("Error al buscar empleado");
    if (!empleado) throw new Error("Empleado no existe");

    // 2. Validar PIN
    if (empleado.pin !== pin) {
      throw new Error("PIN incorrecto");
    }

    // 3. Obtener permisos
    const { data: rolData, error: errorRol } = await supabase
      .from("permisos")
      .select("permisos")
      .eq("rol", empleado.tipo_empleado)
      .maybeSingle();

    if (errorRol) throw new Error("Error obteniendo permisos");

    // 4. Guardar sesión (SIEMPRE JSON)
    setUsuario(empleado);
    setPermisos(rolData?.permisos || {});

    localStorage.setItem("usuario-supabase", JSON.stringify(empleado));
    localStorage.setItem("permisos", JSON.stringify(rolData?.permisos || {}));

    return empleado;
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUsuario(null);
    setPermisos({});
    localStorage.removeItem("usuario-supabase");
    localStorage.removeItem("permisos");
  };

  // 🔒 VALIDAR PERMISOS SEGURO
  const tienePermiso = (permiso) => {
    return permisos?.[permiso] === true;
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        usuario,
        permisos,
        tienePermiso,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);