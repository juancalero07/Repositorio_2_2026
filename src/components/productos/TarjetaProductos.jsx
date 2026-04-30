import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(productos && productos.length > 0));
  }, [productos]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando productos...</h5>
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center mt-5 py-4">
          <i className="bi bi-box-seam" style={{ fontSize: '3.5rem', color: '#6c757d' }}></i>
          <p className="mt-3 text-muted">No hay productos disponibles para mostrar.</p>
        </div>
      ) : (
        <div>
          {productos.map((producto) => {
            const tarjetaActiva = idTarjetaActiva === producto.id_producto;

            return (
              <Card
                key={producto.id_producto}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-producto-contenedor"
                onClick={() => alternarTarjetaActiva(producto.id_producto)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(producto.id_producto);
                  }
                }}
              >
                <Card.Body className={`p-3 ${tarjetaActiva ? "tarjeta-producto-cuerpo-activo" : "tarjeta-producto-cuerpo-inactivo"}`}>
                  <Row className="align-items-center gx-3">
                    {/* Imagen del producto */}
                    <Col xs={3} md={2}>
                      {producto.url_imagen ? (
                        <Image
                          src={producto.url_imagen}
                          alt={producto.nombre}
                          className="rounded"
                          style={{
                            width: "100%",
                            height: "85px",
                            objectFit: "cover",
                            border: "2px solid #f8f9fa"
                          }}
                        />
                      ) : (
                        <div 
                          className="bg-light d-flex align-items-center justify-content-center rounded"
                          style={{ width: "100%", height: "85px" }}
                        >
                          <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }}></i>
                        </div>
                      )}
                    </Col>

                    {/* Información del producto */}
                    <Col xs={6} md={7}>
                      <div className="fw-bold fs-6 text-truncate">
                        {producto.nombre}
                      </div>
                      <div className="small text-muted text-truncate">
                        {producto.nombre_categoria || "Sin categoría"}
                      </div>
                      <div className="mt-1">
                        <strong className="text-success">
                          C${parseFloat(producto.precio || 0).toFixed(2)}
                        </strong>
                        {producto.stock !== undefined && (
                          <span className="ms-3 badge bg-secondary">
                            Stock: {producto.stock}
                          </span>
                        )}
                      </div>
                    </Col>

                    {/* Estado / Indicador */}
                    <Col xs={3} md={3} className="text-end">
                      <div className={`fw-semibold small ${producto.stock > 0 ? 'text-success' : 'text-danger'}`}>
                        {producto.stock > 0 ? "En stock" : "Sin stock"}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                {/* Acciones cuando la tarjeta está activa */}
                {tarjetaActiva && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                    className="tarjeta-producto-capa"
                  >
                    <div
                      className="d-flex gap-2 justify-content-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirModalEdicion(producto);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-pencil me-1"></i> Editar
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(producto);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-trash me-1"></i> Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetaProductos;