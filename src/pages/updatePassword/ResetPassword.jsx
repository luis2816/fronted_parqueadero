import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, message, Col, Row, Button } from 'antd';
import axios from 'axios';

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenUsed, setTokenUsed] = useState(null); // Se elimina el tipo boolean

  const getTokenFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('token');
  };

  useEffect(() => {
    const token = getTokenFromURL();
    if (!token) {
      navigate('/acceso-restringido');
      return;
    }

    const checkToken = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:7777/api/check-token/${token}`);
        setTokenUsed(response.data.token_used);
      } catch (error) {
        navigate('/acceso-restringido');
      }
    };

    checkToken();
  }, [location.search, navigate]);

  const handleSubmit = async (values) => { // Se elimina el tipo 'any'
    const { password } = values;
    const token = getTokenFromURL();

    try {
      await axios.post('http://127.0.0.1:7777/api/reset-password', { token, password });
      message.success('Contraseña establecida correctamente');
      navigate('/');
    } catch (err) {
      message.error('Error al restablecer la contraseña');
    }
  };

  if (tokenUsed) {
    return <div>El token ya ha sido utilizado. No puedes restablecer la contraseña nuevamente.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4 d-flex align-items-center justify-content-center">
        <div className="col-md-8 linea_separador mb-4">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div className="titulo_proyecto" style={{ borderRight: "0px", flexGrow: 0 }}>
              <p className="font-weight-bold mb-0">Restablecer contraseña</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese una contraseña",
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label="Confirmar Contraseña"
                  name="confirm_password"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Por favor confirme su contraseña",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Las contraseñas no coinciden"));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item className="d-flex justify-content-center">
              <Button type="primary" htmlType="submit">
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
