import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

import supabase from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEditarCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminarCategoria from "../components/categorias/ModalEliminacionCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../components/categorias/TablaCategorias";

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

  // 🔥 NUEVOS ESTADOS
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

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

  // 🔹 Agregar categoría
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

      setNuevaCategoria({
        nombre_categoria: "",
        descripcion_categoria: "",
      });

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

  // 🔥 ABRIR MODALES
  const handleEditar = (cat) => {
    setCategoriaSeleccionada(cat);
    setMostrarEditar(true);
  };

  const handleEliminar = (cat) => {
    setCategoriaSeleccionada(cat);
    setMostrarEliminar(true);
  };

  // 🔥 GUARDAR CAMBIOS (UPDATE)
  const guardarCambios = async () => {
    try {
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre_categoria: categoriaSeleccionada.nombre_categoria,
          descripcion_categoria: categoriaSeleccionada.descripcion_categoria,
        })
        .eq("id", categoriaSeleccionada.id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Categoría actualizada correctamente",
        tipo: "exito",
      });

      setMostrarEditar(false);
      await cargarCategorias();

    } catch (error) {
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar",
        tipo: "error",
      });
    }
  };

  // 🔥 ELIMINAR (DELETE)
  const eliminarCategoria = async () => {
    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoriaSeleccionada.id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Categoría eliminada correctamente",
        tipo: "exito",
      });

      setMostrarEliminar(false);
      await cargarCategorias();

    } catch (error) {
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar",
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
            <TablaCategorias
              categorias={categorias}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          )}
        </Col>
      </Row>

      {/* 🔹 MODAL REGISTRO */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={(e) => {
          const { name, value } = e.target;
          setNuevaCategoria((prev) => ({
            ...prev,
            [name]: value,
          }));
        }}
        agregarCategoria={agregarCategoria}
      />

      {/* 🔥 MODAL EDITAR */}
      <ModalEditarCategoria
        mostrar={mostrarEditar}
        cerrar={() => setMostrarEditar(false)}
        categoria={categoriaSeleccionada}
        setCategoria={setCategoriaSeleccionada}
        guardarCambios={guardarCambios}
      />

      {/* 🔥 MODAL ELIMINAR */}
      <ModalEliminarCategoria
        mostrar={mostrarEliminar}
        cerrar={() => setMostrarEliminar(false)}
        categoria={categoriaSeleccionada}
        eliminar={eliminarCategoria}
      />

      {/* 🔹 NOTIFICACIÓN */}
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
