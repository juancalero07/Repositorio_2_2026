import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Encabezado from "./components/navegacion/Encabezado";
import RutaProtegida from "./components/rutas/RutaProtegida";

import Inicio from './views/Inicio';
import Categorias from "./views/Categorias";
import Catalogo from "./views/Catalogo";
import Productos from "./views/Productos";
import Login from "./views/Login";
import Pagina404 from "./views/Pagina404";
import Permisos from './views/Permisos';
import Empleados from './views/Empleados';
import Clientes from './views/Clientes';
import Ventas from './views/Ventas';

import "./App.css";


function App() {
  return (
    <Router>
      <Encabezado />

      {/* 🔥 AHORA SÍ BIEN USADO */}
      <main className="container mt-4 pt-4">

        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <RutaProtegida>
              <Inicio />
            </RutaProtegida>
          } />
           <Route path="/clientes" element={
            <RutaProtegida>
              <Clientes />
            </RutaProtegida>
          } />

          <Route path="/categorias" element={
            <RutaProtegida>
              <Categorias />
            </RutaProtegida>
          } />

          <Route path="/productos" element={
            <RutaProtegida>
              <Productos />
            </RutaProtegida>
          } />

          <Route path="/catalogo" element={
            <RutaProtegida>
              <Catalogo />
            </RutaProtegida>
          } />

          <Route path="/permisos" element={
            <RutaProtegida>
              <Permisos />
            </RutaProtegida>
          } />
          <Route path="/empleados" element={
            <RutaProtegida>
              <Empleados />
            </RutaProtegida>
          } />
          <Route path="/ventas" element={
            <RutaProtegida>
              <Ventas />
            </RutaProtegida>
          } />

          <Route path="*" element={<Pagina404 />} />

        </Routes>

      </main>
    </Router>
  );
}

export default App;