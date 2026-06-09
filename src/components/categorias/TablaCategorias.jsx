import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
  categorias,
  onEditar,
  onEliminar,
  generarPDFCategoria,
  copiarCategoria,
}) => {
  return (
    <>
      {categorias.length > 0 ? (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="d-none d-md-table-cell">Descripción</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td>{categoria.id_categoria}</td>
                <td>{categoria.nombre_categoria}</td>

                <td className="d-none d-md-table-cell">
                  {categoria.descripcion_categoria}
                </td>

                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-1"
                    onClick={() => onEditar(categoria)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-1"
                    onClick={() => onEliminar(categoria)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-1"
                    onClick={() => generarPDFCategoria(categoria)}
                    title="Generar PDF"
                  >
                    <i className="bi bi-file-earmark-pdf"></i>
                  </Button>

                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => copiarCategoria(categoria)}
                    title="Copiar datos"
                  >
                    <i className="bi bi-clipboard"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center mt-4">
          <p>No hay categorías disponibles para mostrar.</p>
        </div>
      )}
    </>
  );
};

export default TablaCategorias;