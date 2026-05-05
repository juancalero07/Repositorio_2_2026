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

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando productos...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <div>
          {productos.map((producto) => {
            const activa = idTarjetaActiva === producto.id_producto;

            return (
              <Card
                key={producto.id_producto}
                className="mb-3 border-0 rounded-3 shadow-sm w-100"
                style={{
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={() => setIdTarjetaActiva(producto.id_producto)}
                onMouseLeave={() => setIdTarjetaActiva(null)}
              >
                <Card.Body style={{ position: "relative" }}>
                  <Row className="align-items-center gx-3">
                    {/* 🔥 IMAGEN CONTROLADA */}
                    <Col xs={3}>
                      {producto.url_imagen ? (
                        <Image
                          src={producto.url_imagen}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            display: "block",
                            margin: "auto",
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light d-flex align-items-center justify-content-center rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            margin: "auto",
                          }}
                        >
                          <i className="bi bi-image text-muted fs-3"></i>
                        </div>
                      )}
                    </Col>

                    {/* INFO */}
                    <Col xs={6}>
                      <div className="fw-semibold text-truncate">
                        {producto.nombre_producto}
                      </div>

                      <div className="small text-muted text-truncate">
                        {producto.descripcion_producto || "Sin descripción"}
                      </div>

                      <div className="small text-muted text-truncate">
                        Categoría:{" "}
                        {producto.Categorias?.nombre_categoria ||
                          "Sin categoría"}
                      </div>
                    </Col>

                    {/* PRECIO */}
                    <Col xs={3} className="text-end">
                      <div className="fw-semibold small">
                        C$ {producto.precio_venta}
                      </div>
                    </Col>
                  </Row>

                  {/* 🔥 BOTONES OVERLAY (HOVER) */}
                  {activa && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                      }}
                    >
                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEdicion(producto);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEliminacion(producto);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetaProductos;