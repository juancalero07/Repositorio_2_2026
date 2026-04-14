import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../database/supabaseconfig";

const RutaProtegida = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const verificarSesion = async () => {
      const { data } = await supabase.auth.getSession();
      setUsuario(data.session);
      setLoading(false);
    };

    verificarSesion();
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;
