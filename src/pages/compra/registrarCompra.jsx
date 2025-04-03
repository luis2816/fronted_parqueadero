import React, { useState } from "react";
import {
  Form,
  Input,
  message,
  Col,
  Row,
  Button,
  Select,
  DatePicker,
} from "antd";
import axios from "axios";
import moment from "moment";
import { Usuario } from "../../types/interfaceUsuario";
import { insertUsuario, verificarUserEmail } from "../../services/usuarioServices";
import { insertTransaccion_temporal } from "../../services/transaccion_temporal/transaccionTemporalService";
import { loginService } from "../../services/login/loginService";
import CONFIG from "../../config";

const API_URL = CONFIG.API_URL;
const { Option } = Select;

const Comprar = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cantidadLicencias, setCantidadLicencias] = useState(0);
  const [totalPagar, setTotalPagar] = useState(0);
  const [step, setStep] = useState(1); // 1: Verify Email, 2: Register, 3: Login, 4: Buy Licenses
  const [email, setEmail] = useState("");
  const [idUsuario, setIdUsuario] = useState(null);
  


  const precioPorLicencia = 1000;

  const handleEmailVerification = async () => {
    const emailValue = form.getFieldValue("email");
    if (!emailValue) {
      message.error("Por favor ingrese un correo electrónico válido");
      return;
    }

    try {
      setLoading(true);
      const response = await verificarUserEmail(emailValue);
      if (response.status === 200) {
        message.success("Correo electrónico no registrado, proceda a registrarse");
        setStep(2); // Move to registration step
      } else {
        message.success("Correo electrónico ya registrado, proceda a iniciar sesión");
        setStep(3); // Move to login step
      }
      setEmail(emailValue);
    } catch (error) {
      message.error("Error al verificar el correo electrónico");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();

      const formattedValues = {
        ...values,
        fecha_nacimiento: values.fecha_nacimiento
          ? moment(values.fecha_nacimiento).format("YYYY-MM-DD")
          : undefined,
        fecha_registro: moment().format("YYYY-MM-DD"),
        rol_id: 1,
        estado: true,
      };

      const formData = new FormData();
      for (const key in formattedValues) {
        if (formattedValues[key] !== undefined) {
          formData.append(key, formattedValues[key ]);
        }
      }

      try {
        const responseTransaccion_temporal = await insertTransaccion_temporal(formattedValues)

        if (responseTransaccion_temporal.transaction_id) {

          try {
            const responsePay = await axios.post(`${API_URL}/compra_sin_registro`, {
              id_usuario_temporal: responseTransaccion_temporal.transaction_id,
              cantidad: Number(values.cantidad_licencia), // Convertir a número
              precio: Number(precioPorLicencia), // Convertir a número

            });

            const paymentUrl = responsePay.data.payment_url;
            message.success("Orden creada con éxito");
            window.location.href = paymentUrl;
          } catch (error) {
            message.error("Ha ocurrido un error al generar la compra");

          }

        }

      } catch (error) {
        message.error("Ha ocurrido un error al generar el registro de la compra");

      }

    } catch (err) {
      message.error("Error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue(["email", "password"]);
      const response = await loginService(values.email, values.password);
      if (response.status === 200) {
        message.success("Inicio de sesión exitoso, ahora puede comprar licencias");
        setStep(4); // Move to buy licenses step
        setIdUsuario(response.user.id)
      } else {
        message.error("Credenciales incorrectas");
      }
    } catch (err) {
      message.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleCantidadChange = (e) => {
    const cantidad = parseInt(e.target.value, 10) || 0;
    setCantidadLicencias(cantidad);
    const total = cantidad * precioPorLicencia;
    setTotalPagar(total);
  };

  const handleBuySubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const responsePay = await axios.post(`${API_URL}/pay`, {
        id_usuario: idUsuario,
        cantidad: values.cantidad_licencia,
        precio: precioPorLicencia,
      });
      const paymentUrl = responsePay.data.payment_url;
      message.success("Orden creada con éxito");
      window.location.href = paymentUrl;
    } catch (error) {
      message.error("Error al crear la orden de pago");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  return (
    <div className="container mt-5">
      <div className="row mb-4 d-flex align-items-center justify-content-center">
        <div className="col-md-8 linea_separador mb-4">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div className="titulo_proyecto" style={{ borderRight: "0px", flexGrow: 0 }}>
              <p className="font-weight-bold mb-0">Registrar compra</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Form form={form} layout="vertical" onFinish={
            step === 2 ? handleRegisterSubmit :
              step === 3 ? handleLoginSubmit : handleBuySubmit
          }>
            {step === 1 && (
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    label="Correo Electrónico"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el correo electrónico",
                      },
                      {
                        type: "email",
                        message: "Ingrese un correo electrónico válido",
                      },
                    ]}
                  >
                    <Input type="email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={handleEmailVerification}
                      loading={loading}
                      style={{ marginTop: "30px" }}
                    >
                      Verificar Correo
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            )}
            {step === 2 && (
              <>
                <Form.Item
                  label="Correo Electrónico"
                  name="email"
                  initialValue={email}
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el correo electrónico",
                    },
                    {
                      type: "email",
                      message: "Ingrese un correo electrónico válido",
                    },
                  ]}
                >
                  <Input type="email" disabled />
                </Form.Item>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Tipo de Identificación"
                      name="tipo_identificacion"
                      rules={[
                        {
                          required: true,
                          message: "Por favor seleccione el tipo de identificación",
                        },
                      ]}
                    >
                      <Select>
                        <Option value="Cedula de ciudadania">Cédula de ciudadanía</Option>
                        <Option value="Pasaporte">Pasaporte</Option>
                        <Option value="RUC">RUC</Option>
                        <Option value="Otro">Otro</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Número de Identificación"
                      name="numero_identificacion"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese el número de identificación",
                        },
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Nombre"
                      name="nombre"
                      rules={[
                        { required: true, message: "Por favor ingrese el nombre" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Apellido"
                      name="apellido"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese el apellido",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8} md={8} lg={8}>
                    <Form.Item
                      label="Sexo"
                      name="sexo"
                      rules={[
                        { required: true, message: "Por favor seleccione el sexo" },
                      ]}
                    >
                      <Select placeholder="Selecciona una opción">
                        <Option value="Masculino">Masculino</Option>
                        <Option value="Femenino">Femenino</Option>
                        <Option value="Otro">Otro</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8} md={8} lg={8}>
                    <Form.Item
                      label="Teléfono"
                      name="telefono"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese el número de teléfono",
                        },
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8} md={8} lg={8}>
                    <Form.Item
                      label="Fecha de Nacimiento"
                      name="fecha_nacimiento"
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Cantidad de Licencias"
                      name="cantidad_licencia"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese la cantidad de licencias",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        min={0}
                        value={cantidadLicencias}
                        onChange={handleCantidadChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item label="Total a Pagar">
                      <Input value={formatCurrency(totalPagar)} readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                      >
                        Registrar Compra
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            {step === 3 && (
              <>
                <Form.Item
                  label="Correo Electrónico"
                  name="email"
                  initialValue={email}
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el correo electrónico",
                    },
                    {
                      type: "email",
                      message: "Ingrese un correo electrónico válido",
                    },
                  ]}
                >
                  <Input type="email" disabled />
                </Form.Item>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese una contraseña",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Iniciar Sesión
                </Button>
              </>
            )}
            {step === 4 && (
              <>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Cantidad de Licencias"
                      name="cantidad_licencia"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese la cantidad de licencias",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        min={0}
                        value={cantidadLicencias}
                        onChange={handleCantidadChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item label="Total a Pagar">
                      <Input value={formatCurrency(totalPagar)} readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                      >
                        Registrar Compra
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Comprar;
