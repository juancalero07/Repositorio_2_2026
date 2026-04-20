import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminarCategoria = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  categoriaAEliminar,
  eliminarCategoria,
}) => {
  // Paso 2 de la guía: variable de estado y método para evitar doble clic
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEliminar = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await eliminarCategoria();
    setIsSubmitting(false);
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Está seguro de que desea eliminar la categoría{" "}
        <strong>"{categoriaAEliminar?.nombre_categoria}"</strong>?
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Eliminando..." : "Eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarCategoria;