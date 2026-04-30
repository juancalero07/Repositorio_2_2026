import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import supabase from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";

import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  // Modales
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

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

  // ==================== CARGAR CATEGORÍAS ====================
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

  // ==================== FILTRO ====================
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
  }, [textoBusqueda, categorias]);

  // ==================== ABRIR MODALES ====================
  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({ ...categoria });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // ==================== CRUD ====================
  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre_categoria.trim() || !nuevaCategoria.descripcion_categoria.trim()) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos", tipo: "advertencia" });
        return;
      }

      const { error } = await supabase
        .from("categorias")
        .insert([nuevaCategoria]);

      if (error) throw error;

      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);
      await cargarCategorias();

      setToast({ mostrar: true, mensaje: "Categoría registrada correctamente", tipo: "exito" });
    } catch (error) {
      console.error(error);
      setToast({ mostrar: true, mensaje: "Error al registrar la categoría", tipo: "error" });
    }
  };

  const actualizarCategoria = async () => {
    try {
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre_categoria: categoriaEditar.nombre_categoria,
          descripcion_categoria: categoriaEditar.descripcion_categoria,
        })
        .eq("id_categoria", categoriaEditar.id_categoria);

      if (error) throw error;

      setMostrarModalEdicion(false);
      await cargarCategorias();

      setToast({ mostrar: true, mensaje: "Categoría actualizada correctamente", tipo: "exito" });
    } catch (error) {
      console.error(error);
      setToast({ mostrar: true, mensaje: "Error al actualizar categoría", tipo: "error" });
    }
  };

  const eliminarCategoria = async () => {
    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id_categoria", categoriaAEliminar.id_categoria);

      if (error) throw error;

      setMostrarModalEliminacion(false);
      await cargarCategorias();

      setToast({ mostrar: true, mensaje: "Categoría eliminada correctamente", tipo: "exito" });
    } catch (error) {
      console.error(error);
      setToast({ mostrar: true, mensaje: "Error al eliminar categoría", tipo: "error" });
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h3>Gestión de Categorías</h3>
        </Col>
        <Col className="text-end">
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
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando categorías...</p>
        </div>
      ) : (
      <>
          {/* ==================== TARJETAS (se muestran en móviles y tablets) ==================== */}
          <div className="d-lg-none">   {/* Solo visible en pantallas < lg (móviles) */}
            <TarjetaCategoria
              categorias={categoriasFiltradas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </div>

          {/* ==================== TABLA (se muestra solo en computadoras) ==================== */}
          <div className="d-none d-lg-block">   {/* Solo visible en pantallas ≥ lg */}
            <TablaCategorias
              categorias={categoriasFiltradas}
              onEditar={abrirModalEdicion}
              onEliminar={abrirModalEliminacion}
            />
          </div>
        </>
      )}

    {/* ==================== MODALES ==================== */}

<ModalRegistroCategoria
  mostrarModal={mostrarModal}
  setMostrarModal={setMostrarModal}
  nuevaCategoria={nuevaCategoria}
  manejoCambioInput={(e) => 
    setNuevaCategoria({ ...nuevaCategoria, [e.target.name]: e.target.value })
  }
  agregarCategoria={agregarCategoria}
/>

<ModalEdicionCategoria
  mostrarModalEdicion={mostrarModalEdicion}
  setMostrarModalEdicion={setMostrarModalEdicion}
  categoriaEditar={categoriaEditar}
  setCategoriaEditar={setCategoriaEditar}          
  manejoCambioInputEdicion={(e) => 
    setCategoriaEditar({ ...categoriaEditar, [e.target.name]: e.target.value })
  }
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