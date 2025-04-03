import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Table,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  message,
  Col,
  Row,
  Upload,
  Popconfirm,
  notification,
  Typography,
  Card,
  Statistic,
  Dropdown,
  Menu,
  ColorPicker,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  ClearOutlined,
  LoadingOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import moment from "moment"; // Importa moment.js
import Swal from "sweetalert2";

import { updateVigilante } from "../../services/Vigilantes/vigilanteService";
import { obtenerConjuntos } from "../../services/conjuntos/ConjuntoService";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import ExportPDF from "../../components/ExportPDF";
import ExportExcel from "../../components/ExportExcel";
import CONFIG from "../../config";
import {
  insertResidente,
  obtenerResidentes,
  updateResidente,
} from "../../services/Residentes/residentesService";

const API_URL = CONFIG.API_URL;

const { Option } = Select;
const { Title } = Typography;

const FormVisitante = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const user = useSelector((state) => state.user);
  const userIdNumber = Number(user.id);


  const onFinish = async (values) => {
    try {
      // Formatea la fecha de nacimiento al formato "YYYY-MM-DD"
      const formattedValues = {
        ...values,
        id_residente_conjunto: editingUser.id_residente_conjunto,
        fecha_nacimiento: values.fecha_nacimiento
          ? moment(values.fecha_nacimiento).format("YYYY-MM-DD")
          : undefined,
        fecha_registro: moment().format("YYYY-MM-DD"), // Agrega la fecha de registro actual
      };

      let response;
      if (isEditing && editingUser) {
        response = await updateResidente(editingUser.id, formattedValues);
      } else {
        response = await insertResidente(formattedValues);
      }

      switch (response.status) {
        case 200:
          const successMessage = isEditing
            ? "Residente actualizado"
            : "Residente registrado";

          setImageUrl("");
          form.resetFields(); // Limpiar el formulario después de una operación exitosa
          handleOk(); // Cerrar el modal
          fetchData(); // Refrescar los datos
          setIsEditing(false); // Resetear el estado de edición
          setEditingUser(null); // Limpiar el usuario en edición

          Swal.fire({
            title: successMessage,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          break;

        case 401:
          Swal.fire({
            title: "Error",
            text: response.msg || "⚠️ Credenciales incorrectas",
            icon: "warning",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          break;

        case 500:
          Swal.fire({
            title: "Error del servidor",
            text: "❌ Ha ocurrido un error inesperado",
            icon: "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          break;

        default:
          Swal.fire({
            title: "Error desconocido",
            text: "⚠️ Algo salió mal",
            icon: "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          break;
      }
    } catch (error) {
      console.log("Ingreso aquí en el catch:", error);
      message.error("Ha ocurrido un error inesperado");
    }
  };




  const handleColorChange = (color) => {
    // Obtener solo el código hexadecimal y actualizar el campo del formulario
    form.setFieldsValue({ color: color.toHexString() });
  };


  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div className="container">
      <div className="row mb-2 d-flex align-items-center">
      <Form form={form} layout="vertical">
            <Row gutter={16}>
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
            </Row>

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
                    <Option value="Cedula de ciudadania">
                      Cédula de ciudadanía
                    </Option>
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
                  <Input type="number" disabled={isEditing} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label="Sexo"
                  name="sexo"
                  rules={[
                    { required: true, message: "Por favor seleccione el sexo" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="Masculino">Masculino</Radio>
                    <Radio value="Femenino">Femenino</Radio>
                    <Radio value="Otro">Otro</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
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
                  <Input disabled={isEditing} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12}>
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
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label="Fecha de Nacimiento"
                  name="fecha_nacimiento"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione la fecha de nacimiento",
                    },
                  ]}
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Form.Item
                  label="Selecciona conjunto cerrado"
                  name="id_conjunto"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un conjunto cerrado",
                    },
                  ]}
                >
                  <Select disabled={isEditing}>
                    {listaConjuntos.map((conjunto) => (
                      <Option key={conjunto.id} value={conjunto.id}>
                        {conjunto.nombre}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Form.Item
                  label="Número de Apartamento"
                  name="numero_apartamento"
                  rules={[
                    {
                      required: true,
                      message: "Ingrese el número de apartamento",
                    },
                  ]}
                >
                  <Input placeholder="Ejemplo: 301, A-12" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <Form.Item
                  label="Número de Parqueadero"
                  name="numero_parqueadero"
                >
                  <Input placeholder="Ejemplo: P-5, 12B (Opcional)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Form.Item
                  label="Tipo de Vehículo"
                  name="tipo_vehiculo"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione el tipo de vehículo",
                    },
                  ]}
                >
                  <Select placeholder="Seleccione un tipo de vehículo">
                    <Select.Option value="Carro">Carro</Select.Option>
                    <Select.Option value="Camioneta">Camioneta</Select.Option>
                    <Select.Option value="Camión">Camión</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Form.Item
                  label="Placa"
                  name="placa"
                  rules={[
                    {
                      required: true,
                      message: "Ingrese la placa del vehículo",
                    },
                    {
                      pattern: /^[A-Z]{3}[0-9]{3}$/,
                      message: "Formato inválido (Ej: ABC123)",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ejemplo: ABC123"
                    maxLength={6}
                    onInput={(e) => {
                      e.target.value = e.target.value.toUpperCase(); // Convierte a mayúsculas automáticamente
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8}>
                <Form.Item
                  label="Marca"
                  name="marca"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione la marca del vehículo",
                    },
                  ]}
                >
                  <Select placeholder="Seleccione una marca">
                    <Select.Option value="Toyota">Toyota</Select.Option>
                    <Select.Option value="Honda">Honda</Select.Option>
                    <Select.Option value="Yamaha">Yamaha</Select.Option>
                    <Select.Option value="Ford">Ford</Select.Option>
                    <Select.Option value="Chevrolet">Chevrolet</Select.Option>
                    <Select.Option value="BMW">BMW</Select.Option>
                    <Select.Option value="Mercedes-Benz">
                      Mercedes-Benz
                    </Select.Option>
                    <Select.Option value="Suzuki">Suzuki</Select.Option>
                    <Select.Option value="Kawasaki">Kawasaki</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form form={form}>
                  <Form.Item
                    label="Color"
                    name="color"
                    rules={[{ required: true, message: "Seleccione un color" }]}
                  >
                    <ColorPicker
                      showText
                      format="hex"
                      presets={[
                        {
                          label: "Básicos",
                          colors: [
                            "#FF0000",
                            "#00FF00",
                            "#0000FF",
                            "#FFFF00",
                            "#FFA500",
                            "#800080",
                          ],
                        },
                        {
                          label: "Neutros",
                          colors: [
                            "#000000",
                            "#FFFFFF",
                            "#808080",
                            "#C0C0C0",
                            "#FF69B4",
                            "#A52A2A",
                          ],
                        },
                      ]}
                      onChange={handleColorChange} // Guardar solo el código hex
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item label="Modelo" name="modelo">
                  <Input placeholder="Ejemplo: 2022, 2018" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
      </div>
    </div>
  );
};

export default FormVisitante;
