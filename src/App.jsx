import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Encabezado from "./components/navegacion/Encabezado";
import RutaProtegida from "./components/rutas/RutaProtegida";

import Inicio from './views/Inicio';
import Categorias from "./views/Categorias";
import Catalogo from "./views/Catalogo";
import Productos from "./views/Productos";
import Login from "./views/Login";
import Pagina404 from "./views/Pagina404";

import "./App.css";

function App() {
  return (
    <Router>
      <Encabezado />
      <main className="container margen-superior-main"></main>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <RutaProtegida>
            <Inicio />
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

        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}

export default App;