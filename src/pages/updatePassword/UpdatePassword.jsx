import React, { Component } from "react";
import { Form, Input, message, Col, Row, Button } from "antd";
import { useSelector } from "react-redux";
import { updatePassword } from "../../services/UpdatePassword/updatePasswordService";

import "../updatePerfil/perfil.css";
const UpdatePassword = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const userIdNumber = Number(user.id);

  const handleSubmit = async (values) => {
    const { old_password, new_password } = values;
    const data = {
      old_password,
      new_password,
    };
  
    try {
      const response = await updatePassword(userIdNumber, data);
      // Manejar la respuesta según el código de estado HTTP
      switch (response.status) {
        case 400:
          message.warning(response.msg);
          break;
        case 401:
          message.error(response.msg);
          break;
        case 404:
          message.error(response.msg);
          break;
        case 500:
          message.error(response.msg);
          break;
        case 200:
          form.resetFields(); // Limpiar el formulario después de una operación exitosa
          message.success(response.msg);
          // Redirigir o realizar otra acción aquí
          break;
        default:
          message.error("Respuesta desconocida del servidor");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Ocurrió un error al intentar actualizar la contraseña");
    }
  };
  
  return (
    <div className="container mt-5">
    <div className="row mb-4 d-flex align-items-center justify-content-center">
      <div className="col-md-8 linea_separador mb-4">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="titulo_proyecto" style={{ borderRight: "0px", flexGrow: 0 }}>
            <p className="font-weight-bold mb-0">Cambiar contraseña</p>
          </div>
        </div>
      </div>
    </div>
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6"> {/* Ajustar el tamaño del contenedor del formulario */}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Contraseña anterior"
                name="old_password"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese una contraseña",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial",
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
                label="Nueva contraseña"
                name="new_password"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese una contraseña",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial",
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
                dependencies={["new_password"]}
                rules={[
                  {
                    required: true,
                    message: "Por favor confirme su contraseña",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Las contraseñas no coinciden")
                      );
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
              Actualizar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  </div>
  
  );
};

export default UpdatePassword;
