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
} from "../../services/Residentes/residentesService";

const API_URL = CONFIG.API_URL;

const { Option } = Select;
const { Title } = Typography;

const Residentes = () => {
  const [dataResidentes, setDataResidentes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [listaConjuntos, setListaConjuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [pagination] = useState({ pageSize: 30, current: 1 });
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar si es edición
  const [editingUser, setEditingUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [file, setFile] = useState(undefined);
  const [searchText, setSearchText] = useState("");

  const user = useSelector((state) => state.user);
  const userIdNumber = Number(user.id);

  const headers = [
    "Identificación",
    "Nombre",
    "Apellido",
    "Genero",
    "Teléfono",
    "Nombre conjunto",
    "# Apartamento",
    "# Parqueadero",
    "Tipo de Vehículo",
    "Placa",
    "Marca",
    "Color",
    "Modelo",
  ];
  const keys = [
    "numero_identificacion",
    "nombre",
    "apellido",
    "sexo",
    "telefono",
    "nombre_conjunto",
    "numero_apartamento",
    "numero_parqueadero",
    "tipo_vehiculo",
    "placa",
    "marca",
    "color",
    "modelo",
  ];
  // Estado para controlar la exportación
  const [exporting, setExporting] = useState(false);
  // Estado para controlar la exportación
  const [exportingPDF, setExportingPDF] = useState(false);

  const handleExportExcel = () => {
    setExporting(true); // Activa la exportación
    setTimeout(() => setExporting(false), 500); // Resetea el estado después de exportar
  };

  const handleExportPDF = () => {
    setExportingPDF(true); // Activa la exportación
    setTimeout(() => setExportingPDF(false), 500); // Resetea el estado después de exportar
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="excel"
        icon={<FileExcelOutlined />}
        onClick={handleExportExcel}
      >
        Exportar a Excel
      </Menu.Item>
      <Menu.Item key="pdf" icon={<FilePdfOutlined />} onClick={handleExportPDF}>
        Exportar a PDF
      </Menu.Item>
    </Menu>
  );

  const handleEdit = async (record) => {
    console.log(record);
    setIsEditing(true);
    setEditingUser(record);
    // Configurar la URL de la imagen en el estado para el campo Upload
    setOpen(true);
  };

  const onFinish = async (values) => {
    try {
      // Formatea la fecha de nacimiento al formato "YYYY-MM-DD"
      const formattedValues = {
        ...values,
        fecha_nacimiento: values.fecha_nacimiento
          ? moment(values.fecha_nacimiento).format("YYYY-MM-DD")
          : undefined,
        fecha_registro: moment().format("YYYY-MM-DD"), // Agrega la fecha de registro actual
      };

      let response;
      if (isEditing && editingUser) {
        response = await updateVigilante(editingUser.id, formattedValues);
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

  const handleClearFilters = () => {
    setSearchText("");
    setFilteredData(dataResidentes);
  };

  const handleConfirm = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
      })
      .catch((info) => {
        console.log("Validación fallida:", info);
      });
  };
  const handleCancelConfirm = () => {
    notification.info({
      message: "Info",
      description: "El envío del formulario ha sido cancelado",
    });
  };

  const fetchData = async () => {
    try {
      const { status, data } = await obtenerResidentes(userIdNumber);
      console.log(data);
      setDataResidentes(data);
      setFilteredData(data);
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const fetchConjuntos = async () => {
    try {
      const response = await obtenerConjuntos(userIdNumber);
      setListaConjuntos(response);
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = async () => {
    setSearchTerm("");
    fetchData();
  };
  useEffect(() => {
    fetchData();
    fetchConjuntos();
  }, []);

  // useEffect para ajustar el formulario en modo edición
  useEffect(() => {
    if (isEditing && editingUser) {
      form.setFieldsValue({
        nombre: editingUser.nombre,
        apellido: editingUser.apellido,
        tipo_identificacion: editingUser.tipo_identificacion,
        numero_identificacion: editingUser.numero_identificacion,
        sexo: editingUser.sexo,
        email: editingUser.email,
        password: editingUser.password,
        telefono: editingUser.telefono,
        fecha_nacimiento: editingUser.fecha_nacimiento
          ? moment(editingUser.fecha_nacimiento)
          : null,
        rol_id: editingUser.rol_id,
        id_conjunto: editingUser.id_conjunto,
        numero_apartamento: editingUser.numero_apartamento,
        numero_parqueadero: editingUser.numero_parqueadero,
        tipo_vehiculo: editingUser.tipo_vehiculo,
        placa: editingUser.placa,
        marca: editingUser.marca,
        color: editingUser.color,
        modelo: editingUser.modelo,
      });
    } else {
      form.resetFields();
    }
  }, [isEditing, editingUser]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterData(value);
  };

  const filterData = (texto) => {
    let filtered = [...dataResidentes];

    // Filtro por texto de búsqueda
    if (texto?.trim()) {
      // Verifica que no sea nulo, vacío o solo espacios
      filtered = filtered.filter((vigilante) =>
        Object.values(vigilante).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(texto.toLowerCase())
        )
      );
    }
    // Actualiza los datos filtrados
    setFilteredData(filtered);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setIsEditing(false);
    setEditingUser(null);
    setImageUrl("");
  };

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      const url = URL.createObjectURL(info.file.originFileObj);
      setImageUrl(url);
      setFile(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = ({ file, onSuccess }) => {
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
    onSuccess(file);
  };
  const handleColorChange = (color) => {
    // Obtener solo el código hexadecimal y actualizar el campo del formulario
    form.setFieldsValue({ color: color.toHexString() });
  };
  const columns = [
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      render: (text, record) => (
        <Button
          type="primary"
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEdit(record)}
        />
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 100,
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      width: 100,
    },
    {
      title: "Tipo de identificación",
      dataIndex: "tipo_identificacion",
      key: "tipo_identificacion",
      width: 180,
    },
    {
      title: "Número de identificación",
      dataIndex: "numero_identificacion",
      key: "numero_identificacion",
      width: 220,
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
      width: 100,
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "fecha_nacimiento",
      key: "fecha_nacimiento",
      width: 200,
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 100,
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      width: 100,
    },
    {
      title: "# Apartamento",
      dataIndex: "numero_apartamento",
      key: "numero_apartamento",
      width: 100,
    },
    {
      title: "# Parqueamiento",
      dataIndex: "numero_parqueadero",
      key: "numero_parqueadero",
      width: 100,
    },
  ];

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
        <div className="col-md-12 linea_separador mb-2 d-flex align-items-center">
          <div
            className="titulo_proyecto"
            style={{ flexBasis: "25%", flexGrow: 0 }}
          >
            <p>Gestión de Residentes</p>
          </div>
          <div className="objeto" style={{ flexBasis: "75%", flexGrow: 0 }}>
            <p>
              Administra eficientemente los Residentes de cada conjunto cerrado
            </p>
          </div>
        </div>

        <Row gutter={[16, 16]} className="mb-4">
          <Col span={24}>
            <div className="filter-container">
              <Row gutter={[16, 16]} align="middle">
                {/* Barra de búsqueda */}
                <Col xs={24} sm={12} md={6} lg={10}>
                  <div className="filter-item">
                    <Title
                      level={5}
                      className="filter-label"
                      style={{ color: "#042956" }}
                    >
                      Búsqueda
                    </Title>
                    <Input
                      placeholder="Buscar..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={handleSearch}
                    />
                  </div>
                </Col>
                {/* Botón Limpiar */}
                <Col xs={12} sm={6} md={3} lg={3}>
                  <Button
                    type="primary"
                    icon={<ClearOutlined />}
                    style={{ width: "100%", marginTop: "24px" }}
                    onClick={handleClearFilters}
                  >
                    Limpiar
                  </Button>
                </Col>
                <Col xs={12} sm={6} md={3} lg={3}>
                  <Dropdown overlay={menu} placement="bottomLeft">
                    <Button
                      type="primary"
                      style={{ width: "100%", marginTop: "24px" }}
                      icon={<DownloadOutlined />}
                    >
                      Exportar
                    </Button>
                  </Dropdown>
                  {/* Renderiza el componente solo cuando exporting es true */}
                  {exporting && (
                    <ExportExcel
                      headers={headers}
                      keys={keys}
                      data={filteredData}
                      fileName={"Reporte_residentes"}
                    />
                  )}
                  {exportingPDF && (
                    <ExportPDF
                      title={"LISTA DE RESIDENTES"}
                      headers={headers}
                      keys={keys}
                      data={filteredData}
                      fileName={"Reporte_residentes"}
                    />
                  )}
                </Col>

                <Col xs={12} sm={6} md={3} lg={3}>
                  <Button
                    type="primary"
                    onClick={() => setOpen(true)}
                    style={{
                      width: "100%",
                      marginTop: "24px",
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                    icon={<PlusOutlined />}
                  >
                    Nuevo
                  </Button>
                </Col>

                {/* Total */}
                <Col xs={12} sm={6} md={3} lg={3}>
                  <Card
                    size="small"
                    style={{
                      marginTop: "24px",
                      textAlign: "center",
                      backgroundColor: "#f0f5ff", // Fondo azul claro
                    }}
                  >
                    <Statistic
                      title="Total Residentes"
                      value={filteredData.length}
                      valueStyle={{
                        color: "#1890ff",
                        fontWeight: "bold",
                      }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {filteredData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            bordered
            pagination={pagination}
            sortDirections={["ascend", "descend"]}
            loading={loading}
            scroll={{ y: 400, x: "max-content" }}
          />
        ) : (
          <div style={{ textAlign: "center", margin: "20px" }}>
            <Alert
              message="No hay resultados"
              description="No se encontraron Vigilantes"
              type="info"
              showIcon
            />
          </div>
        )}

        <Modal
          title={
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
              {isEditing ? "Editar Residente" : "Registrar Nuevo Residente"}
            </h2>
          }
          style={{ top: 20 }}
          width={800}
          open={open}
          onOk={() => form.submit()}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancelar
            </Button>,
            <Popconfirm
              key="confirm"
              title="¿Estás seguro de enviar el formulario?"
              onConfirm={handleConfirm}
              onCancel={handleCancelConfirm}
              okText="Sí"
              cancelText="No"
            >
              <Button type="primary">
                {isEditing ? "Actualizar" : "Registrar"}
              </Button>
            </Popconfirm>,
          ]}
        >
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
        </Modal>
      </div>
    </div>
  );
};

export default Residentes;
