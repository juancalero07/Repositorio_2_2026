import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminarCategoria = ({
  mostrar,
  cerrar,
  categoria,
  eliminar,
}) => {
  return (
    <Modal show={mostrar} onHide={cerrar}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Categoría</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Seguro que deseas eliminar la categoría{" "}
        <strong>{categoria?.nombre_categoria}</strong>?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={cerrar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarCategoria;
