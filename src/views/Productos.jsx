import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import supabase from "../database/supabaseconfig";

import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TarjetaProductos from "../components/productos/TarjetaProductos";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    archivo: null,
  });

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    }
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivoActualizar = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setProductoEditar((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id_producto", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
      setProductosFiltrados(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });
      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter(p => 
        p.nombre_producto?.toLowerCase().includes(textoBusqueda.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  const abrirModalEdicion = (producto) => {
    setProductoEditar({ ...producto });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    if (window.confirm(`¿Eliminar "${producto.nombre_producto}"?`)) {
      eliminarProducto(producto.id_producto);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await supabase.from("productos").delete().eq("id_producto", id);
      setToast({ mostrar: true, mensaje: "Producto eliminado", tipo: "exito" });
      cargarProductos();
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al eliminar", tipo: "error" });
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col><h3>Gestión de Productos</h3></Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => setMostrarModal(true)}>
            Nuevo Producto
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

      {cargando ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Cargando productos...</p>
        </div>
      ) : (
        <TarjetaProductos
          productos={productosFiltrados}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />
      )}

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={() => alert("Función agregarProducto no implementada aún")}
        categorias={categorias}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        manejoCambioArchivoActualizar={manejoCambioArchivoActualizar}
        actualizarProducto={() => alert("Función actualizarProducto no implementada aún")}
        categorias={categorias}
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

export default Productos;