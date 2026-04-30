import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({ 
  productos, 
  onEditar, 
  onEliminar 
}) => {
  return (
    <>
      {productos.length > 0 ? (
        <Table striped bordered hover responsive size="sm">
          <thead className="table-dark">
            <tr>
              <th className="text-center" style={{ width: '80px' }}>Imagen</th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th className="text-end">Precio (C$)</th>
              <th className="text-center">Stock</th>
              <th className="d-none d-lg-table-cell">Descripción</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto}>
                {/* Columna de Imagen */}
                <td className="text-center">
                  {producto.url_imagen ? (
                    <Image
                      src={producto.url_imagen}
                      alt={producto.nombre}
                      thumbnail
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover' 
                      }}
                    />
                  ) : (
                    <div 
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '6px',
                        border: '1px solid #dee2e6'
                      }}
                    >
                      <i className="bi bi-image text-muted" style={{ fontSize: '24px' }}></i>
                    </div>
                  )}
                </td>

                <td>{producto.id_producto}</td>
                <td><strong>{producto.nombre}</strong></td>
                <td>{producto.nombre_categoria || "Sin categoría"}</td>
                <td className="text-end fw-semibold">
                  {parseFloat(producto.precio).toFixed(2)}
                </td>
                <td className="text-center">
                  <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td className="d-none d-lg-table-cell text-truncate" style={{ maxWidth: '250px' }}>
                  {producto.descripcion || "Sin descripción"}
                </td>

                {/* Acciones */}
                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-1"
                    onClick={() => onEditar(producto)}
                    title="Editar producto"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onEliminar(producto)}
                    title="Eliminar producto"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center mt-5 py-4">
          <i className="bi bi-box-seam" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
          <p className="mt-3 text-muted">No hay productos disponibles para mostrar.</p>
        </div>
      )}
    </>
  );
};

export default TablaProductos;