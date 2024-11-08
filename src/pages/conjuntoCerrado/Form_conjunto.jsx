import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, InputNumber, Button, Upload, Steps, Card, Space, Row, Col, message, Typography, Alert, Modal } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
import axios from "axios";
import CONFIG from "../../config";



//Servicio
import { insertConjunto } from "../../services/conjuntos/ConjuntoService";
import { obtenerTotalConjuntos } from "../../services/conjuntos/ConjuntoService";

const { Step } = Steps;
const { TextArea } = Input;
const { Title } = Typography;
const API_URL = CONFIG.API_URL;
const precioPorLicencia = 1000;



const Form_conjunto = () => {
  const [current, setCurrent] = useState(0);
  const [conjuntosRegistrados, setConjuntosRegistrados] = useState(0);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const user = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidadLicencias, setCantidadLicencias] = useState(0);
  const [totalPagar, setTotalPagar] = useState(0);
  const [loading, setLoading] = useState(false);

  const obtenerTotal = async () => {
    try {
      const conjuntos = await obtenerTotalConjuntos(user.id);
      console.log(conjuntos.total_conjuntos);
      console.log(user.cantidad_licencias);
      setConjuntosRegistrados(conjuntos.total_conjuntos);

    } catch (err) {
      setError("Error l obtener datos");
    }
  };


  useEffect(() => {
    obtenerTotal();
  }, []);


  const handleCantidadChange = (e) => {
    const value = e.target.value;
    setCantidadLicencias(value);
    // Aquí puedes actualizar el total a pagar basado en la cantidad
    setTotalPagar(value * 10); // Ejemplo de cálculo, cambiar según sea necesario
};

const handleBuyLicenses = async () => {
  try {
    setLoading(true);
    const values = form.getFieldsValue();
    const responsePay = await axios.post(`${API_URL}/pay`, {
      id_usuario: user.id,
      cantidad: cantidadLicencias,
      precio: precioPorLicencia,
    });
    const paymentUrl = responsePay.data.payment_url;
    message.success("Orden creada con éxito");
    setModalVisible(false);
    window.open(paymentUrl, '_blank');
  } catch (error) {
    message.error("Error al crear la orden de pago");
  } finally {
    setLoading(false);
  }
};


  const beforeUpload = (file) => {
    const validTypes = [".obj", ".fbx", ".stl"];
    const isValidType = validTypes.includes(
      file.name
        .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
        .toLowerCase()
    );
    if (!isValidType) {
      message.error("Solo se permiten archivos .obj, .fbx, .stl");
    }
    return isValidType;
  };

  const handleChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} archivo cargado correctamente`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} archivo no se pudo cargar`);
    }
  };

  const next = async () => {
    try {
      // Validar campos del paso actual
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrent(current + 1);
    } catch (error) {
      // Manejar errores de validación
      console.log("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };


  const onFinish = async (values) => {

    try {
      const data = {
        ...formData,
        ...values,
        usuario_id: user.id,
      };

      const respuesta = await insertConjunto(data);
      if (respuesta.status == 200) {
        message.success(respuesta.msg);
        setCurrent(0);
        form.resetFields();
        setFormData({}); // Reiniciar los datos acumulados del formulario
      } else {
        message.warning(respuesta.msg);

      }
    } catch (error) {
      message.error("Ha ocurrido un error inesperado");
    }
    // Aquí puedes enviar los datos al backend
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const steps = [
    {
      title: "Información Básica",
      content: (
        <>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Nombre del conjunto"
                name="nombre"
                rules={[
                  { required: true, message: "Por favor ingresa el nombre" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Dirección"
                name="direccion"
                rules={[
                  { required: true, message: "Por favor ingresa la dirección" },
                ]}
              >
                <Input type="text" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Teléfono"
                name="telefono"
                rules={[
                  { required: true, message: "Por favor ingresa la teléfono" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Email de Contacto"
                name="email_contacto"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Por favor ingresa email de contacto",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item
                label="Website"
                name="website"
                rules={[
                  {
                    type: "url",
                    message: "Por favor ingresa una URL válida",
                  },
                ]}
              >
                <Input type="url" placeholder="https://example.com" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Detalles del Conjunto",
      content: (
        <>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Número de Apartamentos"
                name="numero_apartamentos"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa el número de apartamentos",
                  },
                ]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="No. de Parqueaderos Residentes"
                name="numero_parqueaderos_residentes"
                rules={[
                  {
                    required: true,
                    message:
                      "Por favor ingresa el número de parqueaderos para residentes",
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="No. de Parqueaderos Visitantes"
                name="numero_parqueaderos_visitantes"
                rules={[
                  {
                    required: true,
                    message:
                      "Por favor ingresa el número de parqueaderos para visitantes",
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Comuna" name="zona">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Ciudad" name="ciudad">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Código Postal" name="codigo_postal">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item
                label="Cargar Modelo 3D"
                name="model3D"
                valuePropName="file"
              >
                <Upload
                  name="file"
                  accept=".obj,.fbx,.stl"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Información Adicional",
      content: (
        <>
          <Form.Item label="Descripción" name="descripcion">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Servicios Comunes" name="servicios_comunes">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Reglamento Interno" name="reglamento_interno">
            <TextArea rows={4} />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <>
    {user.cantidad_licencias !== null && conjuntosRegistrados < user.cantidad_licencias? (
  <Card
  style={{
    maxWidth: 800,
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <Link to="/dashboard/conjunto_cerrado">
      <Button
        type="primary"
        size="large"
        icon={<ArrowLeftOutlined />}
      >
        Volver
      </Button>
    </Link>
    <Title level={1} style={{ flexGrow: 1, textAlign: 'center' }}>
      Registrar Conjunto Cerrado
    </Title>
  </div>

  <Steps current={current} style={{ marginBottom: "20px" }}>
    {steps.map((item) => (
      <Step key={item.title} title={item.title} />
    ))}
  </Steps>

  <Form
    form={form} // Pasar la instancia del formulario aquí
    layout="vertical"
    name="conjuntoCerrado"
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
  >
    {steps[current].content}
    <Form.Item>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Space>
          {current > 0 && <Button onClick={() => prev()}>Anterior</Button>}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Siguiente
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          )}
        </Space>
      </div>
    </Form.Item>
  </Form>
</Card>
    ):(
    <Card>
   <Alert
                message="Licencias agotadas"
                description={
                    <div>
                        La cantidad de licencias disponibles se ha agotado. Si deseas adquirir una, puedes dar clic{' '}
                        <Button type="link" onClick={() => setModalVisible(true)}>aquí</Button>.
                    </div>
                }
                type="warning"
                showIcon
            />
            <Modal
                title="Comprar Licencias"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null} // Sin pie de página predeterminado
            >
                <Form onFinish={handleBuyLicenses}>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                label="Cantidad de Licencias"
                                name="cantidad_licencia"
                                rules={[{ required: true, message: "Por favor ingrese la cantidad de licencias" }]}
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
                                <Input value={totalPagar} readOnly />
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
                </Form>
            </Modal>
    </Card>
   
    )}
    
    </>
  
  );

};
export default Form_conjunto;
