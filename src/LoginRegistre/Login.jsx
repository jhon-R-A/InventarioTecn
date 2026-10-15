import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup
} from "react-bootstrap";

import "./Login.css";

function Login() {

  const [modo, setModo] = useState("login");

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modo === "registro") {

      if (form.password !== form.confirmarPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      console.log("Registrando usuario:", form);

      alert("¡Cuenta creada correctamente! 🎉");

    } else {

      console.log("Iniciando sesión:", {
        email: form.email,
        password: form.password
      });

      alert("¡Inicio de sesión exitoso! 🚀");
    }
  };

  return (
    <div className="login-page">

      <Container>
      <Row className="justify-content-center align-items-center w-100 m-0">

          <Col xs={12} sm={10} md={8} lg={5}>

            <Card className="login-card shadow-lg border-0">

              <Card.Body className="p-4 p-md-5">

                {/* LOGO / TITULO */}

                <div className="text-center mb-4">

                  <div className="logo-circle">
                    <span>🚀</span>
                  </div>

                  <h2 className="fw-bold mt-3">
                    {modo === "login"
                      ? "Bienvenido"
                      : "Crear cuenta"}
                  </h2>

                  <p className="text-muted">
                    {modo === "login"
                      ? "Inicia sesión para continuar"
                      : "Regístrate y comienza ahora"}
                  </p>

                </div>


                {/* BOTONES LOGIN / REGISTRO */}

                <div className="auth-buttons mb-4">

                  <Button
                    className={
                      modo === "login"
                        ? "active-button"
                        : "inactive-button"
                    }
                    onClick={() => setModo("login")}
                  >
                    Iniciar sesión
                  </Button>

                  <Button
                    className={
                      modo === "registro"
                        ? "active-button"
                        : "inactive-button"
                    }
                    onClick={() => setModo("registro")}
                  >
                    Registrarse
                  </Button>

                </div>


                <Form onSubmit={handleSubmit}>

                  {/* NOMBRE */}

                  {modo === "registro" && (

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Nombre completo
                      </Form.Label>

                      <InputGroup>

                        <InputGroup.Text>
                          👤
                        </InputGroup.Text>

                        <Form.Control
                          type="text"
                          name="nombre"
                          placeholder="Tu nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          required
                        />

                      </InputGroup>

                    </Form.Group>

                  )}


                  {/* EMAIL */}

                  <Form.Group className="mb-3">

                    <Form.Label>
                      Correo electrónico
                    </Form.Label>

                    <InputGroup>

                      <InputGroup.Text>
                        ✉️
                      </InputGroup.Text>

                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />

                    </InputGroup>

                  </Form.Group>


                  {/* PASSWORD */}

                  <Form.Group className="mb-3">

                    <Form.Label>
                      Contraseña
                    </Form.Label>

                    <InputGroup>

                      <InputGroup.Text>
                        🔒
                      </InputGroup.Text>

                      <Form.Control
                        type={
                          mostrarPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />

                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          setMostrarPassword(!mostrarPassword)
                        }
                        type="button"
                      >
                        {mostrarPassword ? "🙈" : "👁️"}
                      </Button>

                    </InputGroup>

                  </Form.Group>


                  {/* CONFIRMAR PASSWORD */}

                  {modo === "registro" && (

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Confirmar contraseña
                      </Form.Label>

                      <InputGroup>

                        <InputGroup.Text>
                          🔐
                        </InputGroup.Text>

                        <Form.Control
                          type="password"
                          name="confirmarPassword"
                          placeholder="Repite tu contraseña"
                          value={form.confirmarPassword}
                          onChange={handleChange}
                          required
                        />

                      </InputGroup>

                    </Form.Group>

                  )}


                  {/* RECORDAR */}

                  {modo === "login" && (

                    <div className="d-flex justify-content-between align-items-center mb-4">

                    

                      <a href="#" className="forgot-password">
                        ¿Olvidaste tu contraseña?
                      </a>

                    </div>

                  )}


                  {/* BOTON */}

                  <Button
                    type="submit"
                    className="login-submit w-100"
                  >

                    {modo === "login"
                      ? "Iniciar sesión 🚀"
                      : "Crear mi cuenta ✨"}

                  </Button>

                </Form>


                {/* SEPARADOR */}

                <div className="separator">
                  <span>o continúa con</span>
                </div>


                {/* REDES */}

                <div className="social-buttons">

                  <Button variant="light">
                    🌐 Google
                  </Button>
                </div>


                {/* CAMBIO */}

                <div className="text-center mt-4">

                  {modo === "login" ? (
                    <p>
                      ¿No tienes una cuenta?{" "}

                      <button
                        className="link-button"
                        onClick={() => setModo("registro")}
                      >
                        Regístrate
                      </button>
                    </p>
                  ) : (
                    <p>
                      ¿Ya tienes una cuenta?{" "}

                      <button
                        className="link-button"
                        onClick={() => setModo("login")}
                      >
                        Inicia sesión
                      </button>
                    </p>
                  )}

                </div>

              </Card.Body>

            </Card>

          </Col>

        </Row>
      </Container>

    </div>
  );
}

export default Login;
