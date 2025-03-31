import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Layout, Input, message, Row, Col, Tooltip } from "antd";
import "./login.css";
import { loginService } from "../../services/login/loginService";
import { fetchUserData } from "../../redux/userSlice";
import Swal from "sweetalert2";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Usa el tipo AppDispatch

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const data = await loginService(email, password);
      switch (data.status) {
        case 200:
          localStorage.setItem("token", data.access_token);
          dispatch(fetchUserData(data.user.id));
          Swal.fire({
            title: "¡Bienvenido!",
            text: `${data.user.nombre} ${data.user.apellido}`,
            icon: "success",
            toast: true, // Convierte la alerta en un toast pequeño
            position: "top", // La muestra en la parte superior
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 3000, // La alerta desaparece después de 3 segundos
            timerProgressBar: true, // Muestra una barra de progreso mientras se cierra
          });

          navigate("/dashboard");
          break;

        case 401:
          Swal.fire({
            title: "Error",
            text: "⚠️ Credenciales incorrectas",
            icon: "warning",
            confirmButtonText: "Intentar de nuevo",
          });
          break;

        case 500:
          Swal.fire({
            title: "Error del servidor",
            text: "❌ Ha ocurrido un error inesperado",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
          break;

        default:
          Swal.fire({
            title: "Error desconocido",
            text: "⚠️ Algo salió mal",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
          break;
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "⚠️ No se pudo iniciar sesión",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container d-flex justify-content-end align-items-center">
        <div className="login-form-wrapper">
          <div className="login-form-box">
            <Form
              onFinish={handleSubmit}
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <span style={{ fontWeight: "bold", color: "#224484" }}>
                    Usuario
                  </span>
                }
                name="username"
                rules={[
                  { required: true, message: "Por favor, ingrese su usuario!" },
                ]}
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite email"
                />
              </Form.Item>
              <Form.Item
                className="input-login"
                label={
                  <span style={{ fontWeight: "bold", color: "#224484" }}>
                    Contraseña
                  </span>
                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese su contraseña!",
                  },
                ]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite contraseña"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={loading}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </Form.Item>
            </Form>
            <h2 className="text-center mt-2">Bienvenid@</h2>
            <h4 className="text-center">
              <a
                href="https://www.fao.org/colombia/es/"
                className="no-decoration-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.fao.org
              </a>
            </h4>
            <hr />
            <h6 className="text-center">soporte@comunix.co</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
