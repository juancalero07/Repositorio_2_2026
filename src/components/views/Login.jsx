import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../database/supabaseconfig";   // ← default import (como en tu proyecto)

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);   // ← añadido
  const navegar = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Mejor chequeo de sesión
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) {
      navegar("/");
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navegar]);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usuario.trim(),
        password: contrasena.trim(),
      });

      if (error) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      if (data.user) {
        localStorage.setItem("usuario-supabase", data.user.email);
        navegar("/");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #52b5d1, #b5fffc)", // mejor visual
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <Card className="p-4 shadow" style={{ borderRadius: "15px" }}>
              <h4 className="text-center mb-4">Iniciar Sesión</h4>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={iniciarSesion}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="w-100 mt-3" 
                  disabled={loading}
                >
                  {loading ? "Ingresando..." : "Entrar"}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;