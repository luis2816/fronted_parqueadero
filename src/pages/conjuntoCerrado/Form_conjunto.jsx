import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Steps,
  Card,
  Space,
  Row,
  Col,
  message,
  Typography,
  Alert,
  Modal,
  Select,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import CONFIG from "../../config";
import dataDepartamentos from "../../data/DepartamentosXMunicipios.json";

//Servicio
import {
  insertConjunto,
  updateConjunto,
} from "../../services/conjuntos/ConjuntoService";
import { obtenerTotalConjuntos } from "../../services/conjuntos/ConjuntoService";

const { Step } = Steps;
const { TextArea } = Input;
const { Title } = Typography;
const API_URL = CONFIG.API_URL;
const precioPorLicencia = 1000;

const Form_conjunto = ({ initialData, onVolver }) => {
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
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [departamentosxmunicipio, setDepartamentosxmunicipio] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [municipioSelecionado, setMunicipioSelecionado] = useState([]);

  const obtenerdepartamentos = useCallback(async () => {
    try {
      setDepartamentos([]);
      form.setFieldsValue({ departamentos: [] });

      console.log(dataDepartamentos.Departamentos);
      setDepartamentosxmunicipio(dataDepartamentos.Departamentos);

      let uniqueDepartamentos = dataDepartamentos.Departamentos.map(
        (departamento) => ({
          id: departamento.oid_departamento,
          nombre: departamento.nombre_departamento,
        })
      );

      setDepartamentos(uniqueDepartamentos);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  }, [form]);

  const handleFileChange = (info) => {
    const file = info.fileList[0]?.originFileObj || null;
  
    // Validar que sea un archivo GLB
    if (file && file.type !== "model/gltf-binary") {
      Swal.fire({
        title: "Formato no permitido",
        text: "Solo se permiten archivos GLB",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
  
    setImage(file);
  };
  
  const obtenerTotal = async () => {
    try {
      const conjuntos = await obtenerTotalConjuntos(user.id);
      setConjuntosRegistrados(conjuntos.total_conjuntos);
    } catch (err) {
      setError("Error l obtener datos");
    }
  };
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerdepartamentos();
      if (initialData && Object.keys(initialData).length > 0) {
        form.setFieldsValue(initialData); // Corregido `setFieldValue` a `setFieldsValue`
        setIsEditing(true);
      } else {
        obtenerTotal();
      }
    };

    cargarDatos();
  }, [form, initialData]);

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

      Swal.fire({
        title: "Orden creada con éxito",
        text: "Serás redirigido al pago en unos segundos...",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setModalVisible(false);
      setTimeout(() => {
        window.open(paymentUrl, "_blank");
      }, 2000); // Redirige después de 2 segundos para dar tiempo a la notificación
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al crear la orden de pago",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
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
      Swal.fire({
        title: "Formato no permitido",
        text: "Solo se permiten archivos .obj, .fbx, .stl",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    return isValidType;
  };

  const handleChange = (info) => {
    if (info.file.status === "done") {
      Swal.fire({
        title: "Carga exitosa",
        text: `${info.file.name} archivo cargado correctamente`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else if (info.file.status === "error") {
      Swal.fire({
        title: "Error de carga",
        text: `${info.file.name} archivo no se pudo cargar`,
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const next = async () => {
    try {
      // Validar campos del paso actual
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrent(current + 1);
    } catch (error) {}
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
      // Combinar los valores acumulados con los del último paso
      const finalFormData = { ...data, ...values };

      // Crear FormData para enviar al backend
      const formDataEnvio = new FormData();

      Object.keys(finalFormData).forEach((key) => {
        if (finalFormData[key]) {
          formDataEnvio.append(key, finalFormData[key]);
        }
      });

      // Agregar imagen si existe
      if (image) {
        formDataEnvio.append("soporte", image);
      }

      // Enviar datos al backend
      const respuesta = isEditing
        ? await updateConjunto(initialData.id, formDataEnvio)
        : await insertConjunto(formDataEnvio);

      if (respuesta.status === 200) {
        Swal.fire({
          title: "Éxito",
          text: respuesta.msg,
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setCurrent(0);
        form.resetFields();
        setFormData({}); // Reiniciar formulario
        setImage(null); // Limpiar imagen
        onVolver();
      } else {
        Swal.fire({
          title: "Advertencia",
          text: respuesta.msg,
          icon: "warning",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error inesperado",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {};

  // Maneja el cambio de estado del departamento de novedad
  const handleDepartamentoNovedadChange = (valor) => {
    const lista_municipios = departamentosxmunicipio.find(
      (dep) => dep.nombre_departamento === valor
    );

    if (lista_municipios && lista_municipios.municipios) {
      // Ordenar la lista de municipios alfabéticamente por nombre
      const municipiosOrdenados = lista_municipios.municipios.sort((a, b) => {
        if (a.nombre_municipio < b.nombre_municipio) return -1;
        if (a.nombre_municipio > b.nombre_municipio) return 1;
        return 0;
      });

      // Actualizar el estado con la lista de municipios ordenada
      setMunicipios(municipiosOrdenados);
    } else {
      setMunicipios([]);
    }
  };

  const steps = [
    {
      title: "Información Básica",
      content: (
        <>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Nombre del conjunto" name="nombre">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Dirección" name="direccion">
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Departamento" name="departamento" rules={[]}>
                <Select
                  showSearch
                  onChange={handleDepartamentoNovedadChange}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {departamentos.map((depto) => (
                    <Option key={depto.id} value={depto.nombre}>
                      {depto.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Municipio" name="municipio" rules={[]}>
                <Select
                  placeholder="Seleccione un municipio"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {municipios.map((mun) => (
                    <Option
                      key={mun.nombre_municipio}
                      value={mun.nombre_municipio}
                    >
                      {mun.nombre_municipio}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Teléfono" name="telefono">
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Email de Contacto" name="email_contacto">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={16}>
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
            <Col xs={24} sm={8}>
              <Form.Item label="Código Postal" name="codigo_postal">
                <Input />
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
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="No. de Parqueaderos Residentes"
                name="numero_parqueaderos_residentes"
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="No. de Parqueaderos Visitantes"
                name="numero_parqueaderos_visitantes"
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Soporte (Modelo 3D)" name="soporte">
                <Upload
                  beforeUpload={() => false} // Evita la carga automática
                  onChange={handleFileChange}
                  accept=".glb" // Solo permite archivos .glb
                  maxCount={1} // Solo permite un archivo
                >
                  <Button icon={<UploadOutlined />}>Subir modelo GLB</Button>
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
      {user.cantidad_licencias !== null &&
      conjuntosRegistrados < user.cantidad_licencias ? (
        <Card
          style={{
            maxWidth: 800,
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Button
              type="primary"
              onClick={() => onVolver()}
              size="large"
              icon={<ArrowLeftOutlined />}
            >
              Volver
            </Button>

            <Title level={1} style={{ flexGrow: 1, textAlign: "center" }}>
              {isEditing
                ? "Actualizar Conjunto Cerrado"
                : "Registrar Conjunto Cerrado"}
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
                  {current > 0 && (
                    <Button onClick={() => prev()}>Anterior</Button>
                  )}
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
      ) : (
        <Card>
          <Alert
            message="Licencias agotadas"
            description={
              <div>
                La cantidad de licencias disponibles se ha agotado. Si deseas
                adquirir una, puedes dar clic{" "}
                <Button type="link" onClick={() => setModalVisible(true)}>
                  aquí
                </Button>
                .
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
