import React, { useEffect, useState } from "react";
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
  Dropdown,
  Menu,
  Card,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  ClearOutlined,
  LoadingOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import moment from "moment"; // Importa moment.js
import Swal from "sweetalert2";
import {
  obtenerUsuarios,
  insertUsuario,
  obtenerFotoPerfil,
  updateUsuario,
} from "../services/usuarioServices";
import { Usuario } from "../types/interfaceUsuario";
import ExportExcel from "../components/ExportExcel";
import ExportPDF from "../components/ExportPDF";

const { Option } = Select;
const { Title } = Typography;

const Usuarios = () => {
  const [dataUsuarios, setDataUsuario] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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

  const headers = [
    "Identificación",
    "Tipo Identificación",
    "Nombre",
    "Apellido",
    "Genero",
    "Email",
    "Teléfono",
  ];
  const keys = [
    "numero_identificacion",
    "tipo_identificacion",
    "nombre",
    "apellido",
    "sexo",
    "email",
    "telefono",
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
    setIsEditing(true);
    setEditingUser(record);
    // Obtener la URL de la foto de perfil
    const imageUrl = await obtenerFotoPerfil(record.id);
    setImageUrl(imageUrl || ""); // Usa una cadena vacía si no se encuentra la imagen

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

      // Crear FormData y agregar todos los campos de usuario
      const formData = new FormData();
      for (const key in formattedValues) {
        if (formattedValues[key] !== undefined) {
          formData.append(key, formattedValues[key]);
        }
      }

      // Agregar la imagen al FormData si existe
      if (file) {
        formData.append("file", file); // file es el archivo de la imagen
      }

      let response;
      if (isEditing && editingUser) {
        // Modo de edición - actualizar usuario existente
        response = await updateUsuario(editingUser.id, formData); // Asegúrate de que updateUsuario maneje FormData
      } else {
        // Modo de creación - insertar nuevo usuario
        response = await insertUsuario(formData); // Asegúrate de que insertUsuario maneje FormData
      }

      switch (response.status) {
        case 200:
          const successMessage = isEditing
            ? "Usuario actualizado"
            : "Usuario registrado";

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
      Swal.fire({
        title: "Error desconocido",
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
    Swal.fire({
      title: "EInfo",
      text: "El envío del formulario ha sido cancelado",
      icon: "info",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const fetchData = async () => {
    try {
      const usuarios = await obtenerUsuarios();
      console.log(usuarios);
      setDataUsuario(usuarios);
      setFilteredData(usuarios);
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

  const handleCancel = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingUser(null);
    setImageUrl("");
    form.resetFields();
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
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterData(value);
  };

  const filterData = (texto) => {
    let filtered = [...dataUsuarios];

    // Filtro por texto de búsqueda
    if (texto?.trim()) {
      // Verifica que no sea nulo, vacío o solo espacios
      filtered = filtered.filter((usuario) =>
        Object.values(usuario).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(texto.toLowerCase())
        )
      );
    }
    // Actualiza los datos filtrados
    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setFilteredData(dataUsuarios);
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
      title: "Foto de Perfil",
      dataIndex: "foto_perfil_url",
      key: "foto_perfil_url",
      render: (text) =>
        text ? (
          <img
            src={`${text}?t=${new Date().getTime()}`} // Agregar timestamp para forzar el renderizado
            alt="foto perfil"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        ) : (
          <span>No hay foto</span>
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
      width: 200,
    },
    {
      title: "Número de identificación",
      dataIndex: "numero_identificacion",
      key: "numero_identificacion",
      width: 200,
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
            <p>Gestión de usuarios</p>
          </div>
          <div className="objeto" style={{ flexBasis: "75%", flexGrow: 0 }}>
            <p>
              Administra eficientemente los perfiles de usuarios, incluyendo la
              creación, edición, y eliminación de cuentas, así como la
              asignación de roles y permisos. Mantén el control y la seguridad
              de los accesos en tu plataforma de manera sencilla y organizada.
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
                      fileName={"Reporte_usuarios"}
                    />
                  )}
                  {exportingPDF && (
                    <ExportPDF
                      title={"LISTA DE USUARIOS"}
                      headers={headers}
                      keys={keys}
                      data={filteredData}
                      fileName={"Reporte_usuarios"}
                    />
                  )}
                </Col>

                <Col xs={12} sm={6} md={3} lg={3}>
                  <Button
                    type="primary"
                    onClick={showModal}
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
                      title="Total usuarios"
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

        <div className="row mb-4">
          <div className="col-12">
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
                  description="No se encontraron conjuntos cerrados"
                  type="info"
                  showIcon
                />
              </div>
            )}
          </div>
        </div>

        <Modal
          title={
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
              {isEditing ? "Editar Usuario" : "Registrar Nuevo Usuario"}
            </h2>
          }
          style={{ top: 20 }}
          width={1000}
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
                <Form.Item label="Foto de Perfil">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    customRequest={customRequest}
                    onChange={handleUploadChange}
                    accept=".jpg,.jpeg,.png" // Aceptar solo archivos JPG y PNG
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <div>
                        {loading ? <LoadingOutlined /> : <UploadOutlined />}
                        <div style={{ marginTop: 8 }}>Subir Imagen</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

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
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label="Rol"
                  name="rol_id"
                  rules={[
                    { required: true, message: "Por favor seleccione un rol" },
                  ]}
                >
                  <Select>
                    <Option value={1}>Administrador</Option>
                  </Select>
                </Form.Item>
              </Col>

              {!isEditing && (
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    label="Cantidad de Licencias"
                    name="cantidad_licencias"
                    rules={[
                      { required: true, message: "Por favor ingrese un valor" },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Usuarios;
