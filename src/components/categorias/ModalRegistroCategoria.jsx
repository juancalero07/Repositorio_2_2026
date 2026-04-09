import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCategoria = ({
  mostrarModal,
  setMostrarModal,
  nuevaCategoria,
  manejoCambioInput,
  agregarCategoria,
}) => {
  // 1. Los Hooks siempre van al inicio de la función
  const [deshabilitado, setDeshabilitado] = useState(false);

  // 2. Las funciones de lógica van después de los Hooks
  const handleRegistrar = async () => {
    if (deshabilitado) return;
    try {
      setDeshabilitado(true);
      await agregarCategoria();
    } catch (error) {
      console.error("Error al registrar:", error);
    } finally {
      setDeshabilitado(false);
    }
  };

  // 3. El return debe ser lo último dentro de la función
  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_categoria"
              value={nuevaCategoria.nombre_categoria}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_categoria"
              value={nuevaCategoria.descripcion_categoria}
              onChange={manejoCambioInput}
              placeholder="Ingresa la descripción"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={nuevaCategoria.nombre_categoria.trim() === "" || deshabilitado}
        >
          {deshabilitado ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; // Cierre de la función del componente

export default ModalRegistroCategoria;