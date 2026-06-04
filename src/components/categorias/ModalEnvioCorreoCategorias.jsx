import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEnvioCorreoCategorias = ({
  mostrarModalCorreo,
  setMostrarModalCorreo,
  emailDestino,
  setEmailDestino,
  enviandoCorreo,
  enviarCorreoCategorias,
  totalCategorias
}) => {
  return (
    <Modal
      show={mostrarModalCorreo}
      onHide={() => setMostrarModalCorreo(false)}
      centered
    >
      {/* HEADER */}
      <Modal.Header closeButton>
        <Modal.Title>📧 Enviar Categorías</Modal.Title>
      </Modal.Header>

      {/* BODY */}
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Correo destino</Form.Label>
          <Form.Control
            type="email"
            placeholder="ejemplo@correo.com"
            value={emailDestino}
            onChange={(e) => setEmailDestino(e.target.value)}
          />
        </Form.Group>

        <div className="bg-light p-3 rounded text-center border">
          <small>
            Se enviarán <strong>{totalCategorias}</strong> categorías registradas.
          </small>
        </div>
      </Modal.Body>

      {/* FOOTER */}
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalCorreo(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="success"
          onClick={enviarCorreoCategorias}
          disabled={enviandoCorreo}
        >
          {enviandoCorreo ? "Enviando..." : "Enviar Correo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEnvioCorreoCategorias;