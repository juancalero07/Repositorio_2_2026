import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import supabase from "../database/supabaseconfig";
// Componentes de productos
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import TablaProductos from "../components/productos/TablaProductos";
import TarjetaProductos from "../components/productos/TarjetaProductos";
import ModalQRProducto from "../components/productos/ModalQRProducto";
// Componentes generales
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [productoEditar, setProductoEditar] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    archivo: null,
  });

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // 🔍 FUNCIÓN PARA GENERAR QR DINÁMICO (CON VALIDACIÓN DE IMAGEN)
  const generarQRImagen = (producto) => {
    if (!producto?.url_imagen) {
      setToast({
        mostrar: true,
        mensaje: "Este producto no tiene una imagen asignada para generar el QR",
        tipo: "advertencia",
      });
      return;
    }
    setProductoSeleccionado(producto);
    setMostrarModalQR(true);
  };

  // 📋 FUNCIÓN PARA COPIAR DATOS DEL PRODUCTO AL PORTAPAPELES
// 📋 FUNCIÓN PARA COPIAR COMPATIBLE CON TELÉFONOS (HTTP / IPS LOCALES)
  const copiarProducto = async (producto) => {
    if (!producto) return;

    const texto = `ID: ${producto.id_producto}\nProducto: ${producto.nombre_producto}\nPrecio: $${producto.precio_venta || '0.00'}`;

    // 1. Intentar con el método moderno (Funciona en Localhost y Netlify/HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(texto);
        setToast({
          mostrar: true,
          mensaje: `Producto "${producto.nombre_producto}" copiado al portapapeles.`,
          tipo: "exito",
        });
        return; // Si funciona, se detiene aquí
      } catch (err) {
        console.error("Error con navigator.clipboard: ", err);
      }
    }

    // 2. TRUCO DE RESPALDO: Si estás en el celular por IP (HTTP), usa este bloque:
    try {
      const el = document.createElement('textarea');
      el.value = texto;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      setToast({
        mostrar: true,
        mensaje: `Producto "${producto.nombre_producto}" copiado al portapapeles.`,
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error con el método de respaldo: ", err);
      setToast({
        mostrar: true,
        mensaje: "No se pudo copiar en este dispositivo",
        tipo: "error",
      });
    }
  };
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const cargarCategorias = async () => {
    const { data } = await supabase
      .from("categorias")
      .select("*")
      .order("id_categoria", { ascending: true });

    setCategorias(data || []);
  };

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("productos")
        .select(`
          *,
          Categorias:categoria_producto (
            id_categoria,
            nombre_categoria
          )
        `)
        .order("id_producto", { ascending: true });

      if (error) throw error;

      setProductos(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase();

      const filtrados = productos.filter((prod) => {
        return (
          prod.nombre_producto?.toLowerCase().includes(textoLower) ||
          prod.descripcion_producto?.toLowerCase().includes(textoLower)
        );
      });

      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre_producto ||
        !nuevoProducto.categoria_producto ||
        !nuevoProducto.precio_venta ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa todos los campos",
          tipo: "advertencia",
        });
        return;
      }

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;

      await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      const { data } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);

      await supabase.from("productos").insert([
        {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion_producto: nuevoProducto.descripcion_producto,
          categoria_producto: nuevoProducto.categoria_producto,
          precio_venta: parseFloat(nuevoProducto.precio_venta),
          url_imagen: data.publicUrl,
        },
      ]);

      setMostrarModal(false);
      await cargarProductos();

      setToast({
        mostrar: true,
        mensaje: "Producto agregado correctamente",
        tipo: "exito",
      });

    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error al agregar producto",
        tipo: "error",
      });
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar(producto);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const actualizarProducto = async () => {
    try {
      const { error } = await supabase
        .from("productos")
        .update({
          nombre_producto: productoEditar.nombre_producto,
          descripcion_producto: productoEditar.descripcion_producto,
          categoria_producto: productoEditar.categoria_producto,
          precio_venta: parseFloat(productoEditar.precio_venta),
        })
        .eq("id_producto", productoEditar.id_producto);

      if (error) throw error;

      setMostrarModalEdicion(false);
      await cargarProductos();

      setToast({
        mostrar: true,
        mensaje: "Producto actualizado",
        tipo: "exito",
      });

    } catch (err) {
      console.error(err);
    }
  };

  const eliminarProducto = async () => {
    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", productoAEliminar.id_producto);

      if (error) throw error;

      setMostrarModalEliminacion(false);
      await cargarProductos();

      setToast({
        mostrar: true,
        mensaje: "Producto eliminado",
        tipo: "exito",
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h3>Productos</h3>
        </Col>

        <Col className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg"></i> Nuevo
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
          />
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : productosFiltrados.length === 0 ? (
        <Alert>No hay productos</Alert>
      ) : (
        <Row>
          {/* MÓVIL: Tarjetas */}
          <Col xs={12} className="d-lg-none">
            <TarjetaProductos 
              productos={productosFiltrados} 
              generarQRImagen={generarQRImagen}
              copiarProducto={copiarProducto}
            />
          </Col>

          {/* DESKTOP: Tabla */}
          <Col lg={12} className="d-none d-lg-block">
            <TablaProductos
              productos={productosFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
              generarQRImagen={generarQRImagen}
              copiarProducto={copiarProducto}
            />
          </Col>
        </Row>
      )}

      {/* MODALES */}
      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar || {}}
        manejoCambioInputEdicion={(e) => {
          const { name, value } = e.target;
          setProductoEditar((prev) => ({ ...prev, [name]: value }));
        }}
        manejoCambioArchivoActualizar={(e) => {
          const archivo = e.target.files[0];
          if (archivo) {
            setProductoEditar((prev) => ({ ...prev, archivo }));
          }
        }}
        actualizarProducto={actualizarProducto}
        categorias={categorias}
      />

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
        producto={productoAEliminar}
      />

      {/* MODAL DE CÓDIGO QR SINCRONIZADO */}
     {/* MODAL DE CÓDIGO QR CORREGIDO SEGÚN LA GUÍA */}
      <ModalQRProducto
        mostrarModalQR={mostrarModalQR}
        setMostrarModalQR={setMostrarModalQR}
        productoSeleccionado={productoSeleccionado}
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