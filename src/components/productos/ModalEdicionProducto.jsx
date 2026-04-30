import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditar,
  manejoCambioInputEdicion,
  manejoCambioArchivoActualizar,
  actualizarProducto,
  categorias
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarProducto();
    setDeshabilitado(false);
  };

  return (
    <Modal 
      show={mostrarModalEdicion} 
      onHide={() => setMostrarModalEdicion(false)} 
      backdrop="static" 
      centered 
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={productoEditar?.nombre || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  name="id_categoria"
                  value={productoEditar?.id_categoria || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Precio (C$)</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={productoEditar?.precio || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={productoEditar?.stock || ""}
                  onChange={manejoCambioInputEdicion}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={productoEditar?.descripcion || ""}
              onChange={manejoCambioInputEdicion}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen Actual</Form.Label>
            {productoEditar?.url_imagen && (
              <div className="mb-2">
                <img 
                  src={productoEditar.url_imagen} 
                  alt="Producto actual" 
                  style={{ maxWidth: "200px", borderRadius: "8px" }} 
                />
              </div>
            )}
            <Form.Label>Nueva Imagen (opcional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={manejoCambioArchivoActualizar}
            />
            <Form.Text className="text-muted">
              Si no selecciona una nueva imagen, se mantendrá la actual.
            </Form.Text>
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
          disabled={deshabilitado}
        >
          {deshabilitado ? "Actualizando..." : "Actualizar Producto"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;