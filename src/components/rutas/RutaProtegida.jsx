import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RutaProtegida = ({ children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;
  return usuario ? children : <Navigate to="/login" />;
};

export default RutaProtegida;