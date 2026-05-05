import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productos && productos.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [productos]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando productos...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <Table
          striped
          borderless
          hover
          responsive
          size="sm"
          style={{ tableLayout: "fixed" }} 
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th className="d-none d-md-table-cell">Descripción</th>
              <th>Categoria</th>
              <th>Precio de Venta</th>
              <th style={{ width: "70px" }}>Imagen</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>

                <td>{producto.nombre_producto}</td>

                <td className="d-none d-md-table-cell">
                  {producto.descripcion_producto}
                </td>

                <td>
                  {producto.Categorias?.nombre_categoria || "Sin categoría"}
                </td>

                <td>{producto.precio_venta}</td>

                <td style={{ width: "70px", padding: "5px" }}>
                  <Image
                    src={producto.url_imagen}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      display: "block",
                      margin: "auto",
                      borderRadius: "6px",
                    }}
                  />
                </td>

                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(producto)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(producto)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaProductos;