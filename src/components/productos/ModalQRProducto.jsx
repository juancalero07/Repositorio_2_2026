import React from "react";
import { Modal, Button } from "react-bootstrap";
import QRCode from "react-qr-code";

const ModalQRProducto = ({
  mostrarModalQR,
  setMostrarModalQR,
  productoSeleccionado,
}) => {
  // Si no hay ningún producto seleccionado en el estado, no renderiza nada y evita errores
  if (!productoSeleccionado) return null;

  return (
    <Modal
      show={mostrarModalQR}
      onHide={() => setMostrarModalQR(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>QR del Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <h5>{productoSeleccionado.nombre_producto}</h5>

        <div className="d-flex justify-content-center my-3">
          {productoSeleccionado.url_imagen ? (
            /* 🔥 CAMBIO CLAVE: Aquí pasamos directamente la URL de la imagen.
              Al escanear este código QR, el teléfono detectará un enlace web 
              y abrirá la foto del producto automáticamente.
            */
            <QRCode
              value={productoSeleccionado.url_imagen}
              size={220}
            />
          ) : (
            <p className="text-danger my-3">
              Este producto no tiene una imagen asignada en Supabase.
            </p>
          )}
        </div>

        <p>
          Escanee este código QR para abrir y visualizar la imagen del producto.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalQR(false)}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalQRProducto;