import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import supabase from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";

import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";

const Categorias = () => {
  // 🔹 Estados principales
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Estados UI
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [mostrarModal, setMostrarModal] = useState(false);

  // 🔥 ESTADOS REQUERIDOS POR LA GUÍA
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  // Estado para nuevo registro
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  // 🔹 Cargar categorías (CORREGIDO - se usa "id")
  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id", { ascending: true });        // ← Aquí estaba el error

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

  // Paso 5 de la guía → Manejo de inputs de edición
  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCategoriaEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Paso 6 de la guía → ACTUALIZAR (usando "id")
  const actualizarCategoria = async () => {
    try {
      if (
        !categoriaEditar.nombre_categoria.trim() ||
        !categoriaEditar.descripcion_categoria.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      const { error } = await supabase
        .from("categorias")
        .update({
          nombre_categoria: categoriaEditar.nombre_categoria,
          descripcion_categoria: categoriaEditar.descripcion_categoria,
        })
        .eq("id", categoriaEditar.id);           // ← CORREGIDO

      if (error) {
        console.error("Error al actualizar categoria:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar la categoria ${categoriaEditar.nombre_categoria}.`,
          tipo: "error",
        });
        return;
      }

      await cargarCategorias();

      setToast({
        mostrar: true,
        mensaje: `Categoria ${categoriaEditar.nombre_categoria} actualizada exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar categoria.",
        tipo: "error",
      });
      console.error("Excepción al actualizar categoria:", err.message);
    }
  };

  // Paso 10 de la guía → ELIMINAR (usando "id")
  const eliminarCategoria = async () => {
    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoriaAEliminar.id);        // ← CORREGIDO

      if (error) {
        console.error("Error al eliminar categoria:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar la categoria ${categoriaAEliminar.nombre_categoria}.`,
          tipo: "error",
        });
        return;
      }

      await cargarCategorias();

      setToast({
        mostrar: true,
        mensaje: `Categoria ${categoriaAEliminar.nombre_categoria} eliminada exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar categoria.",
        tipo: "error",
      });
      console.error("Excepción al eliminar categoria:", err.message);
    } finally {
      setMostrarModalEliminacion(false);
    }
  };

  // Handlers para abrir modales
  const handleEditar = (cat) => {
    setCategoriaEditar(cat);
    setMostrarModalEdicion(true);
  };

  const handleEliminar = (cat) => {
    setCategoriaAEliminar(cat);
    setMostrarModalEliminacion(true);
  };

  // Agregar categoría (sin cambios)
  const agregarCategoria = async () => {
    try {
      if (
        !nuevaCategoria.nombre_categoria.trim() ||
        !nuevaCategoria.descripcion_categoria.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase
        .from("categorias")
        .insert([nuevaCategoria]);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Categoría "${nuevaCategoria.nombre_categoria}" registrada correctamente.`,
        tipo: "exito",
      });

      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);
      await cargarCategorias();
    } catch (error) {
      setToast({
        mostrar: true,
        mensaje: "Error al registrar categoría.",
        tipo: "error",
      });
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>
              <i className="bi bi-bookmark-fill me-2"></i>
              Categorías
            </h3>
            <Button variant="primary" onClick={() => setMostrarModal(true)}>
              <i className="bi bi-plus-lg"></i> Nueva Categoría
            </Button>
          </div>
          <hr />

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
              <p className="mt-2">Cargando categorías...</p>
            </div>
          ) : (
            <Col xs={12} sm={12} md={12} className="d-none d-lg-block">
              <TablaCategorias
                categorias={categorias}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            </Col>
          )}

          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaCategoria
              categorias={categorias}
              abrirModalEdicion={handleEditar}
              abrirModalEliminacion={handleEliminar}
            />
          </Col>
        </Col>
      </Row>

      {/* MODALES */}
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