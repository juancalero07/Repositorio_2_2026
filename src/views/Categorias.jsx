import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import supabase from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import Paginacion from "../components/ordenamiento/Paginacion";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ModalEnvioCorreoCategorias from "../components/categorias/ModalEnvioCorreoCategorias";
import emailjs from '@emailjs/browser';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);

  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const texto = textoBusqueda.toLowerCase();
      const filtradas = categorias.filter((c) =>
        c.nombre_categoria?.toLowerCase().includes(texto) ||
        c.descripcion_categoria?.toLowerCase().includes(texto)
      );
      setCategoriasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [textoBusqueda, categorias]);

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({ ...categoria });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // 🔥 FUNCIÓN DEFINITIVA CON MAPPING ESTRUCTURADO Y PUBLIC KEY INCLUIDA
  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({ mostrar: true, mensaje: "Ingresa un correo", tipo: "advertencia" });
      return;
    }

    setEnviandoCorreo(true);

    // Formateo estricto con bloques limpios para el contenedor oscuro de tu HTML
    const listaCategorias = categorias.map((c, index) => 
      `${index + 1}. [${c.nombre_categoria.toUpperCase()}]\n   Descripción: ${c.descripcion_categoria || "Sin descripción asignada"}`
    ).join("\n\n");

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        user_email: emailDestino,
        message: listaCategorias 
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Evita el fallo de llave requerida
    )
    .then(() => {
      setToast({ mostrar: true, mensaje: "Correo enviado con éxito", tipo: "exito" });
      setMostrarModalCorreo(false);
    })
    .catch((error) => {
      console.error("Error al enviar con EmailJS:", error);
      setToast({ mostrar: true, mensaje: "Error al enviar el correo", tipo: "error" });
    })
    .finally(() => setEnviandoCorreo(false));
  };

  return (
    <Container className="mt-4">
      {/* HEADER */}
      <Row className="mb-4">
        <Col>
          <h3>Gestión de Categorías</h3>
        </Col>

        <Col className="text-end">
          <Button variant="primary" onClick={abrirModalCorreo} className="me-2">
            📧 Enviar Correo
          </Button>

          <Button variant="success" onClick={() => setMostrarModal(true)}>
            Nueva Categoría
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <TablaCategorias
            categorias={categoriasPaginadas}
            onEditar={abrirModalEdicion}
            onEliminar={abrirModalEliminacion}
          />
        </>
      )}

      <ModalEnvioCorreoCategorias
        mostrarModalCorreo={mostrarModalCorreo}
        setMostrarModalCorreo={setMostrarModalCorreo}
        emailDestino={emailDestino}
        setEmailDestino={setEmailDestino}
        enviandoCorreo={enviandoCorreo}
        enviarCorreoCategorias={enviarCorreoCategorias}
        totalCategorias={categorias.length}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Categorias;