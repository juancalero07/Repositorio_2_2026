import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import supabase from "../database/supabaseconfig";
import Paginacion from "../components/ordenamiento/Paginacion";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";

const Categorias = () => {
  // 🔹 Estados principales
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true); // Usamos 'loading' como definiste arriba

  // 🔹 Estados UI
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
const [paginaActual, establecerPaginaActual] = useState(1);

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // 🔹 Cargar categorías
  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id", { ascending: true });

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

  // Filtrado dinámico
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = categorias.filter((cat) =>
        cat.nombre_categoria.toLowerCase().includes(textoLower) ||
        (cat.descripcion_categoria && cat.descripcion_categoria.toLowerCase().includes(textoLower))
      );
      setCategoriasFiltradas(filtradas);
    }
  }, [textoBusqueda, categorias]);

  // Handlers para modales
  const handleEditar = (cat) => {
    setCategoriaEditar(cat);
    setMostrarModalEdicion(true);
  };

  const handleEliminar = (cat) => {
    setCategoriaAEliminar(cat);
    setMostrarModalEliminacion(true);
  };
  const categoriasPaginadas = categoriasFiltradas.slice(
  (paginaActual - 1) * registrosPorPagina,
  paginaActual * registrosPorPagina
);

  const actualizarCategoria = async () => {
    try {
      if (!categoriaEditar.nombre_categoria.trim() || !categoriaEditar.descripcion_categoria.trim()) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos.", tipo: "advertencia" });
        return;
      }
      setMostrarModalEdicion(false);
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre_categoria: categoriaEditar.nombre_categoria,
          descripcion_categoria: categoriaEditar.descripcion_categoria,
        })
        .eq("id", categoriaEditar.id);

      if (error) throw error;
      await cargarCategorias();
      setToast({ mostrar: true, mensaje: "Categoría actualizada exitosamente.", tipo: "exito" });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al actualizar.", tipo: "error" });
    }
  };

  const eliminarCategoria = async () => {
    try {
      const { error } = await supabase.from("categorias").delete().eq("id", categoriaAEliminar.id);
      if (error) throw error;
      await cargarCategorias();
      setToast({ mostrar: true, mensaje: "Categoría eliminada exitosamente.", tipo: "exito" });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al eliminar.", tipo: "error" });
    } finally {
      setMostrarModalEliminacion(false);
    }
  };

  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre_categoria.trim() || !nuevaCategoria.descripcion_categoria.trim()) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos.", tipo: "advertencia" });
        return;
      }
      const { error } = await supabase.from("categorias").insert([nuevaCategoria]);
      if (error) throw error;
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);
      await cargarCategorias();
      setToast({ mostrar: true, mensaje: "Categoría registrada.", tipo: "exito" });
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al registrar.", tipo: "error" });
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>
              <i className="bi bi-bookmark-fill me-2"></i> Categorías
            </h3>
            <Button variant="primary" onClick={() => setMostrarModal(true)}>
              <i className="bi bi-plus-lg"></i> Nueva Categoría
            </Button>
          </div>
          <hr />
        </Col>
      </Row>

      {/* 1. Cuadro de búsqueda */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
          />
        </Col>
      </Row>

      {/* 2. Spinner de carga */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p className="mt-2">Cargando categorías...</p>
        </div>
      ) : (
        <>
          {/* 3. Mensaje si no hay resultados */}
          {textoBusqueda.trim() && categoriasFiltradas.length === 0 && (
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron categorías que coincidan con "{textoBusqueda}".
            </Alert>
          )}

          {/* 4. Lista de resultados */}
          {categoriasFiltradas.length > 0 && (
        <Row>
    <Col xs={12} className="d-lg-none">
      {/* CAMBIO AQUÍ: categoriasPaginadas en lugar de categoriasFiltradas */}
      <TarjetaCategoria
        categorias={categoriasPaginadas} 
        abrirModalEdicion={handleEditar}
        abrirModalEliminacion={handleEliminar}
      />
    </Col>
    <Col lg={12} className="d-none d-lg-block">
      {/* CAMBIO AQUÍ: categorias en lugar de categoriasFiltradas */}
      <TablaCategorias
        categorias={categoriasPaginadas} 
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
    </Col>
  </Row>
          )}
        </>
      )}
      {/* Paginación */}
{categoriasFiltradas.length > 0 && (
  <Paginacion
    registrosPorPagina={registrosPorPagina}
    totalRegistros={categoriasFiltradas.length}
    paginaActual={paginaActual}
    establecerPaginaActual={establecerPaginaActual}
    establecerRegistrosPorPagina={establecerRegistrosPorPagina}
  />
)}

      {/* MODALES Y NOTIFICACIONES */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={(e) => {
          const { name, value } = e.target;
          setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
        }}
        agregarCategoria={agregarCategoria}
      />
      <ModalEdicionCategoria
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        categoriaEditar={categoriaEditar}
        setCategoriaEditar={setCategoriaEditar}
        actualizarCategoria={actualizarCategoria}
      />
      <ModalEliminacionCategoria
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        categoriaAEliminar={categoriaAEliminar}
        eliminarCategoria={eliminarCategoria}
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