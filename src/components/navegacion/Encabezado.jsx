import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/react.svg";
import ChatIA from "../ia/ChatIA";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarChatIA, setMostrarChatIA] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { usuario, logout, tienePermiso } = useAuth();

  // 🔥 FUNCIÓN PARA MANDAR A LA RUTA Y OCULTAR EL MENÚ DE FORMA INMEDIATA
  const navegarYCerrar = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false); // Cierra el menú lateral automáticamente
  };

  const cerrarSesion = () => {
    logout();
    setMostrarMenu(false); // Cierra el menú lateral antes de salir
    navigate("/login");
  };

  const esLogin = location.pathname === "/login";

  return (
    <>
      <Navbar
        expand="md"
        fixed="top"
        className="color-navbar"
        variant="dark"
      >
        <Container>
          <Navbar.Brand
            onClick={() => navegarYCerrar("/")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} width="40" className="me-2" alt="Logo" />
            Discosa
          </Navbar.Brand>

          {!esLogin && (
            <Navbar.Toggle onClick={() => setMostrarMenu(true)} />
          )}

          <Navbar.Offcanvas
            show={mostrarMenu}
            onHide={() => setMostrarMenu(false)}
            placement="end"
          >
            <Offcanvas.Header closeButton />

            <Offcanvas.Body>
              <Nav className="ms-auto">

                {tienePermiso("ver_inicio") && (
                  <Nav.Link onClick={() => navegarYCerrar("/")}>
                    Inicio
                  </Nav.Link>
                )}

                {tienePermiso("ver_clientes") && (
                  <Nav.Link onClick={() => navegarYCerrar("/clientes")}>
                    Clientes
                  </Nav.Link>
                )}

                {tienePermiso("ver_categorias") && (
                  <Nav.Link onClick={() => navegarYCerrar("/categorias")}>
                    Categorías
                  </Nav.Link>
                )}

                {tienePermiso("ver_empleados") && (
                  <Nav.Link onClick={() => navegarYCerrar("/empleados")}>
                    Empleados
                  </Nav.Link>
                )}

                {tienePermiso("ver_productos") && (
                  <Nav.Link onClick={() => navegarYCerrar("/productos")}>
                    Productos
                  </Nav.Link>
                )}

                {tienePermiso("ver_catalogo") && (
                  <Nav.Link onClick={() => navegarYCerrar("/catalogo")}>
                    Catálogo
                  </Nav.Link>
                )}

                {tienePermiso("ver_permisos") && (
                  <Nav.Link onClick={() => navegarYCerrar("/permisos")}>
                    Permisos
                  </Nav.Link>
                )}

                {tienePermiso("ver_ventas") && (
                  <Nav.Link onClick={() => navegarYCerrar("/ventas")}>
                    Ventas
                  </Nav.Link>
                )}

                {/* BOTÓN IA */}
                <Nav.Link onClick={() => {
                  setMostrarChatIA(true);
                  setMostrarMenu(false); // Cierra el menú al abrir la IA
                }}>
                  <i className="bi bi-robot me-2"></i>
                  IA
                </Nav.Link>

                {usuario && (
                  <Nav.Link onClick={cerrarSesion}>
                    Cerrar sesión
                  </Nav.Link>
                )}

              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* MODAL CHAT IA */}
      <ChatIA
        mostrar={mostrarChatIA}
        onCerrar={() => setMostrarChatIA(false)}
      />
    </>
  );
};

export default Encabezado;