import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// IMPORTANTE: Asegúrate de importar tu cliente de supabase desde donde lo tengas configurado
import  supabase  from "../database/supabaseconfig";
const Inicio = () => {
  const [cargando, setCargando] = useState(true);
  const [fechaDesde, setFechaDesde] = useState(new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" }));
  const [fechaHasta, setFechaHasta] = useState(new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" }));
  const graficoHoraRef = useRef(null);
  const graficoCategoriaRef = useRef(null);
  const COLORES = ["#5e26b2", "#39ff95", "#ff6bc6", "#8b46ff", "#00d4ff", "#ffd93d"];
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ventasEfectivo: 0,
    ventasTarjeta: 0,
    productosVendidos: 0,
    montoProductos: 0,
    cantidadVentas: 0,
    ventasPorHora: [],
    ventasPorCategoria: []
  });

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);
      const inicioRango = `${desde} 00:00:00`;
      const finRango = `${hasta} 23:59:59`;
      
      const { data: ventas, error } = await supabase
        .from("ventas")
        .select("id_venta, total, fecha_venta, metodo_pago")
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango);

      if (error) throw error;

      const idsVentas = ventas?.map(v => v.id_venta) || [];

      let productosVendidos = 0;
      let montoProductos = 0;
      let ventasPorCategoria = [];

      if (idsVentas.length > 0) {
        const { data: detalles } = await supabase
          .from("detalles_ventas")
          .select(`
            cantidad, 
            subtotal,
            productos (
              nombre_producto,
              categorias (nombre_categoria)
            )
          `)
          .in("id_venta", idsVentas);

        detalles?.forEach(d => {
          productosVendidos += d.cantidad || 0;
          montoProductos += d.subtotal || 0;

          const categoria = d.productos?.categorias?.nombre_categoria || "Sin categoría";
          const existente = ventasPorCategoria.find(c => c.name === categoria);
          
          if (existente) {
            existente.value += d.subtotal || 0;
          } else {
            ventasPorCategoria.push({ name: categoria, value: d.subtotal || 0 });
          }
        });

        ventasPorCategoria.sort((a, b) => b.value - a.value);
      }

      const totalVentas = ventas?.reduce((sum, v) => sum + (v.total || 0), 0) || 0;
      const ventasEfectivo = ventas?.filter(v => v.metodo_pago === "efectivo")
        .reduce((sum, v) => sum + (v.total || 0), 0) || 0;
      const ventasTarjeta = ventas?.filter(v => v.metodo_pago === "tarjeta")
        .reduce((sum, v) => sum + (v.total || 0), 0) || 0;

      const horaMap = Array(24).fill(0);
      ventas?.forEach(venta => {
        if (!venta.fecha_venta) return;
        const hora = new Date(venta.fecha_venta).getHours();
        if (hora >= 0 && hora < 24) horaMap[hora] += venta.total || 0;
      });

      const ventasPorHora = [];
      let acumulado = 0;
      for (let h = 8; h <= 22; h++) {
        acumulado += horaMap[h];
        ventasPorHora.push({
          hora: `${h.toString().padStart(2, "0")}:00`,
          total: Math.round(acumulado)
        });
      }

      setEstadisticas({
        totalVentas,
        ventasEfectivo,
        ventasTarjeta,
        productosVendidos,
        montoProductos,
        cantidadVentas: ventas?.length || 0,
        ventasPorHora,
        ventasPorCategoria
      });
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    } finally {
      setCargando(false);
    }
  };

  const descargarExcel = async () => {
    try {
      setCargando(true);
      const inicioRango = `${fechaDesde} 00:00:00`;
      const finRango = `${fechaHasta} 23:59:59`;

      const { data: ventas, error: errorVentas } = await supabase
        .from("ventas")
        .select(`id_venta, fecha_venta, total, metodo_pago, id_empleado, id_cliente`)
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango)
        .order("fecha_venta", { ascending: false });

      if (errorVentas) throw errorVentas;

      const idsVentas = ventas?.map(v => v.id_venta) || [];
      let detallesVenta = [];

      if (idsVentas.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalles_ventas")
          .select(`
            id_detalle, id_venta, cantidad, precio_unitario, subtotal, id_producto,
            productos (nombre_producto, categorias (nombre_categoria))
          `)
          .in("id_venta", idsVentas)
          .order("id_venta");

        if (errorDetalles) console.error("Error en detalles:", errorDetalles);
        else detallesVenta = detalles || [];
      }

      const wb = XLSX.utils.book_new();

      if (ventas && ventas.length > 0) {
        const wsVentas = XLSX.utils.json_to_sheet(ventas);
        XLSX.utils.book_append_sheet(wb, wsVentas, "Ventas");
      } else {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Mensaje: "No hay ventas en este rango" }]), "Ventas");
      }

      if (detallesVenta && detallesVenta.length > 0) {
        const wsDetalles = XLSX.utils.json_to_sheet(detallesVenta);
        XLSX.utils.book_append_sheet(wb, wsDetalles, "Detalles_Ventas");
      } else {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Mensaje: "No hay detalles de ventas" }]), "Detalles_Ventas");
      }

      XLSX.writeFile(wb, `Reporte_Ventas_${fechaDesde}_a_${fechaHasta}.xlsx`);
    } catch (err) {
      console.error("Error generando Excel:", err);
      alert("Error al generar el Excel. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  const formatearMoneda = (valor) => `C$ ${(Number(valor) || 0).toFixed(2)}`;

  const agregarEncabezadoPDF = (doc, titulo) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(titulo, 14, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Periodo: ${fechaDesde} a ${fechaHasta}`, 14, 24);
    doc.text(`Generado: ${new Date().toLocaleString("es-NI")}`, 14, 30);
  };

  const agregarResumenPDF = (doc, inicioY = 38) => {
    autoTable(doc, {
      startY: inicioY,
      head: [["Indicador", "Valor"]],
      body: [
        ["Ventas totales", formatearMoneda(estadisticas.totalVentas)],
        ["Ventas en efectivo", formatearMoneda(estadisticas.ventasEfectivo)],
        ["Ventas con tarjeta", formatearMoneda(estadisticas.ventasTarjeta)],
        ["Productos vendidos", estadisticas.productosVendidos],
        ["Monto en productos", formatearMoneda(estadisticas.montoProductos)],
        ["Cantidad de ventas", estadisticas.cantidadVentas],
      ],
      theme: "grid",
      headStyles: { fillColor: [94, 38, 178] },
    });
  };

  const agregarGraficoPDF = async (doc, referencia, titulo, inicioY) => {
    if (!referencia.current) return inicioY;

    const canvas = await html2canvas(referencia.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 28;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let posicionY = inicioY;

    if (posicionY + imgHeight + 12 > pageHeight) {
      doc.addPage();
      posicionY = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(titulo, 14, posicionY);
    doc.addImage(imgData, "PNG", 14, posicionY + 6, imgWidth, imgHeight);

    return posicionY + imgHeight + 16;
  };

  const generarReporteGraficoHora = async () => {
    const doc = new jsPDF();
    agregarEncabezadoPDF(doc, "Reporte de Ventas por Hora");
    const posicionY = await agregarGraficoPDF(doc, graficoHoraRef, "Grafico de Ventas por Hora", 40);

    autoTable(doc, {
      startY: posicionY,
      head: [["Hora", "Total acumulado"]],
      body: estadisticas.ventasPorHora.map((item) => [item.hora, formatearMoneda(item.total)]),
      theme: "striped",
      headStyles: { fillColor: [94, 38, 178] },
    });

    doc.save(`Reporte_Ventas_por_Hora_${fechaDesde}_a_${fechaHasta}.pdf`);
  };

  const generarReporteGraficoCategoria = async () => {
    const doc = new jsPDF();
    agregarEncabezadoPDF(doc, "Reporte de Ventas por Categoria");
    const posicionY = await agregarGraficoPDF(doc, graficoCategoriaRef, "Grafico de Ventas por Categoria", 40);

    autoTable(doc, {
      startY: posicionY,
      head: [["Categoria", "Total"]],
      body: estadisticas.ventasPorCategoria.length > 0
        ? estadisticas.ventasPorCategoria.map((item) => [item.name, formatearMoneda(item.value)])
        : [["Sin datos", formatearMoneda(0)]],
      theme: "striped",
      headStyles: { fillColor: [94, 38, 178] },
    });

    doc.save(`Reporte_Ventas_por_Categoria_${fechaDesde}_a_${fechaHasta}.pdf`);
  };

  const generarReporteGeneralPDF = async () => {
    const doc = new jsPDF();
    agregarEncabezadoPDF(doc, "Reporte General de Estadisticas");
    agregarResumenPDF(doc, 40);

    let posicionY = doc.lastAutoTable.finalY + 12;
    posicionY = await agregarGraficoPDF(doc, graficoHoraRef, "Ventas por Hora", posicionY);
    posicionY = await agregarGraficoPDF(doc, graficoCategoriaRef, "Ventas por Categoria", posicionY);

    autoTable(doc, {
      startY: posicionY,
      head: [["Categoria", "Total vendido"]],
      body: estadisticas.ventasPorCategoria.length > 0
        ? estadisticas.ventasPorCategoria.map((item) => [item.name, formatearMoneda(item.value)])
        : [["Sin datos", formatearMoneda(0)]],
      theme: "grid",
      headStyles: { fillColor: [94, 38, 178] },
    });

    doc.save(`Reporte_General_Estadisticas_${fechaDesde}_a_${fechaHasta}.pdf`);
  };

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  // Si está cargando, detiene la ejecución aquí y muestra el Spinner
  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">Cargando estadísticas...</p>
      </Container>
    );
  }

  // Si YA NO está cargando, se salta el IF de arriba y hace el return de todo tu Dashboard
  return (
    <div className="mt-2" style={{ padding: "20px" }}>
      <div className="mb-4">
        <h2>Dashboard</h2>
        <h6>Estadísticas del Negocio</h6>
      </div>

      <Row className="mb-4">
        <Col xs={6} md={3}>
          <Form.Group>
            <Form.Label>Desde</Form.Label>
            <Form.Control type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group>
            <Form.Label>Hasta</Form.Label>
            <Form.Control type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end gap-2 flex-wrap">
          <Button variant="success" onClick={descargarExcel}>
            <i className="bi bi-file-earmark-excel me-2"></i>
            Descargar Excel
          </Button>
          <Button variant="danger" onClick={generarReporteGeneralPDF}>
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Descargar PDF
          </Button>
        </Col>
      </Row>

      {/* Tarjetas */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card className="h-100 text-white shadow" style={{ background: "linear-gradient(135deg, #28a745, #34ce57)" }}>
            <Card.Body>
              <h5>Ventas Totales</h5>
              <h2>C$ {estadisticas.totalVentas.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100 text-white shadow" style={{ background: "linear-gradient(135deg, #0166d3, #3399ff)" }}>
            <Card.Body>
              <h5>Efectivo</h5>
              <h2>C$ {estadisticas.ventasEfectivo.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100 text-white shadow" style={{ background: "linear-gradient(135deg, #5ea5f1, #94c0ec)" }}>
            <Card.Body>
              <h5>Tarjeta</h5>
              <h2>C$ {estadisticas.ventasTarjeta.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100 text-white shadow" style={{ background: "linear-gradient(135deg, #e27d01, #ffa500)" }}>
            <Card.Body>
              <h5>Productos Vendidos</h5>
              <h2>{estadisticas.productosVendidos}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow border-0">
            <Card.Body ref={graficoHoraRef}>
              <h5 className="mb-3">Ventas por Hora</h5>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={estadisticas.ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis tickFormatter={(v) => `C$${v}`} />
                  <Tooltip formatter={(v) => [`C$ ${v}`, "Monto"]} />
                  <Line type="monotone" dataKey="total" stroke="#5e26b2" strokeWidth={4} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
            <div className="px-3 pb-3">
              <Button variant="outline-danger" onClick={generarReporteGraficoHora}>
                <i className="bi bi-file-earmark-pdf me-2"></i>
                PDF Ventas por Hora
              </Button>
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow border-0">
            <Card.Body ref={graficoCategoriaRef}>
              <h5 className="mb-3">Ventas por Categoría</h5>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={estadisticas.ventasPorCategoria.length > 0 ? estadisticas.ventasPorCategoria : [{ name: "Sin datos", value: 1 }]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={110}
                    label
                  >
                    {estadisticas.ventasPorCategoria.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `C$ ${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
            <div className="px-3 pb-3">
              <Button variant="outline-danger" onClick={generarReporteGraficoCategoria}>
                <i className="bi bi-file-earmark-pdf me-2"></i>
                PDF Ventas por Categoria
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Inicio;
