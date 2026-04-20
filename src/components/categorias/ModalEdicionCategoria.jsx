import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionCategoria = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  categoriaEditar,
  setCategoriaEditar,
  actualizarCategoria
}) => {
  // Paso 2 de la guía: variable de estado y método para evitar doble clic
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActualizar = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await actualizarCategoria();
    setIsSubmitting(false);
  };

  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={categoriaEditar?.nombre_categoria || ""}
              onChange={(e) =>
                setCategoriaEditar({
                  ...categoriaEditar,
                  nombre_categoria: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={categoriaEditar?.descripcion_categoria || ""}
              onChange={(e) =>
                setCategoriaEditar({
                  ...categoriaEditar,
                  descripcion_categoria: e.target.value,
                })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEdicion(false)}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Actualizando..." : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategoria;