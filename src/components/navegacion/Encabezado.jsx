import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/react.svg";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { usuario, logout, tienePermiso } = useAuth();

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const esLogin = location.pathname === "/login";

  return (
    <Navbar expand="md " fixed="top" className="color-navbar" variant="dark">
      <Container>
        <Navbar.Brand onClick={() => navigate("/")}>
          <img src={logo} width="40" className="me-2" />
          Discosa
        </Navbar.Brand>

        {!esLogin && <Navbar.Toggle onClick={() => setMostrarMenu(true)} />}

        <Navbar.Offcanvas show={mostrarMenu} onHide={() => setMostrarMenu(false)}>
          <Offcanvas.Header closeButton />
          <Offcanvas.Body>
            <Nav className="ms-auto">

              {tienePermiso("ver_inicio") && (
                <Nav.Link onClick={() => navigate("/")}>Inicio</Nav.Link>
              )}

              {tienePermiso("ver_categorias") && (
                <Nav.Link onClick={() => navigate("/categorias")}>Categorías</Nav.Link>
              )}

              {tienePermiso("ver_productos") && (
                <Nav.Link onClick={() => navigate("/productos")}>Productos</Nav.Link>
              )}

              {tienePermiso("ver_catalogo") && (
                <Nav.Link onClick={() => navigate("/catalogo")}>Catálogo</Nav.Link>
              )}

              {tienePermiso("ver_permisos") && (
                <Nav.Link onClick={() => navigate("/permisos")}>Permisos</Nav.Link>
              )}

              {usuario && (
                <Nav.Link onClick={cerrarSesion}>Cerrar sesión</Nav.Link>
              )}

            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;