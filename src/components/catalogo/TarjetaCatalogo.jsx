import React, { useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";

const TarjetaCatalogo = ({ producto, categoriaNombre }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const descripcion = producto.descripcion_producto || "";
  const previsualizacionTexto =
    descripcion.length > 50
      ? descripcion.substring(0, 50) + "..."
      : descripcion;

  const tieneMasTexto = descripcion.length > 50;

  return (
    <>
      <Card
        className="h-100 border-0 shadow-lg overflow-hidden position-relative cursor-pointer"
        style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
        role="button"
        tabIndex={0}
        onClick={() => setMostrarModal(true)}
        onKeyDown={(e) => e.key === "Enter" && setMostrarModal(true)}
      >
        <div className="ratio ratio-1x1 bg-light">
          {producto.url_imagen ? (
            <img
              src={producto.url_imagen}
              alt={producto.nombre_producto}
              className="card-img-top object-fit-cover"
              loading="lazy"
              style={{ transition: "transform 0.4s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 bg-secondary-subtle">
              <i className="bi bi-image text-muted fs-1"></i>
            </div>
          )}
        </div>

        <Card.Body className="d-flex flex-column p-3">
          <Card.Title className="h6 fw-bold text-dark mb-2">
            {producto.nombre_producto}
          </Card.Title>

          {/* ✅ TEXTO CORREGIDO */}
          {descripcion && (
            <>
              <Card.Text className="text-muted small flex-grow-1">
                {previsualizacionTexto}
                {tieneMasTexto && (
                  <span className="text-primary fw-medium ms-1">
                    Leer más
                  </span>
                )}
              </Card.Text>

              {/* ✅ FUERA DEL <p> */}
              <div className="mt-2">
                <Badge bg="secondary" pill>
                  {categoriaNombre || "Sin categoría"}
                </Badge>
              </div>
            </>
          )}

          <hr />

          {/* ✅ CORREGIDO className */}
          <div className="mt-auto pt-2">
            <h4 className="text-success fw-bold mb-0">
              C${parseFloat(producto.precio_venta).toFixed(1)}
            </h4>
          </div>
        </Card.Body>
      </Card>

      {/* 🔥 MODAL */}
      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {producto.nombre_producto}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row g-4">
            <div className="col-md-5">
              {producto.url_imagen ? (
                <img
                  src={producto.url_imagen}
                  alt={producto.nombre_producto}
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "400px",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              ) : (
                <div
                  className="bg-secondary-subtle rounded d-flex align-items-center justify-content-center"
                  style={{ height: "400px" }}
                >
                  <i className="bi bi-image text-muted fs-1"></i>
                </div>
              )}
            </div>

            <div className="col-md-7">
              <Badge bg="secondary" className="mb-3">
                {categoriaNombre || "Sin categoría"}
              </Badge>

              <h3 className="text-success fw-bold mb-4">
                C${parseFloat(producto.precio_venta).toFixed(1)}
              </h3>

              {descripcion && (
                <>
                  <h5 className="fw-semibold">Descripción</h5>
                  <p className="text-muted">{descripcion}</p>
                </>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;