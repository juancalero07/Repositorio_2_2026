import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEditarCategoria = ({
  mostrar,
  cerrar,
  categoria,
  setCategoria,
  guardarCambios,
}) => {
  return (
    <Modal show={mostrar} onHide={cerrar}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Categoría</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={categoria?.nombre_categoria || ""}
              onChange={(e) =>
                setCategoria({
                  ...categoria,
                  nombre_categoria: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={categoria?.descripcion_categoria || ""}
              onChange={(e) =>
                setCategoria({
                  ...categoria,
                  descripcion_categoria: e.target.value,
                })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={cerrar}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={guardarCambios}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarCategoria;
