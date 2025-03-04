import React, { useEffect, useState } from "react";
import {  useSelector } from 'react-redux';

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
  notification
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  ClearOutlined,
  LoadingOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment"; // Importa moment.js
import {
  obtenerUsuarios,
  insertUsuario,
  obtenerFotoPerfil,
  updateUsuario,
} from "../../services/usuarioServices";

import { obtenerVigilantes, insertVigilante } from "../../services/Vigilantes/vigilanteService";
import { obtenerConjuntos } from "../../services/conjuntos/ConjuntoService";

const { Option } = Select;

const Residentes = () => {
  const [dataUsuarios, setDataUsuario] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState(''); // Agrega este estado para el filtro

  const user = useSelector((state) => state.user);
  const userIdNumber = Number(user.id);


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
        rol_id : 2
      };

   
      console.log(formattedValues);
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
        //response = await updateUsuario(editingUser.id, formData); // Asegúrate de que updateUsuario maneje FormData
      } else {
        // Modo de creación - insertar nuevo usuario
        response = await insertVigilante(formData); // Asegúrate de que insertUsuario maneje FormData
      }

      switch (response.status) {
        case 200:
          const successMessage = isEditing
            ? "Usuario actualizado"
            : "Usuario registrado";
          setImageUrl('');
          form.resetFields(); // Limpiar el formulario después de una operación exitosa
          handleOk(); // Cerrar el modal
          fetchData(); // Refrescar los datos
          setIsEditing(false); // Resetear el estado de edición
          setEditingUser(null); // Limpiar el usuario en edición
          message.success(successMessage);
          break;
        case 401:
          message.warning(response.msg);
          break;
        case 500:
          message.error("Ha ocurrido un error inesperado");
          break;
        default:
          message.error("Ha ocurrido un error inesperado");
          break;
      }
    } catch (error) {
      message.error("Ha ocurrido un error inesperado");
    }
  };

  //Función para buscar un usuario
  const handleSearchInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredUsuarios = dataUsuarios.filter(user =>
      user.nombre.toLowerCase().includes(searchTerm)
    );
    setDataUsuario(filteredUsuarios);

  };


  const handleConfirm = () => {
    form.validateFields().then(values => {
        onFinish(values);
    }).catch(info => {
        console.log('Validación fallida:', info);
    });
};
const handleCancelConfirm = () => {
    notification.info({
        message: 'Info',
        description: 'El envío del formulario ha sido cancelado',
    });
};

  const fetchData = async () => {
    try {
      const {status, data} = await obtenerVigilantes(userIdNumber);
      setDataUsuario(data);
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
  setSearchTerm('')
  fetchData()

  }
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
        id_conjunto :   editingUser.id_conjunto
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
    if (form.isFieldsTouched()) {
      // Si los campos han sido modificados
      Modal.confirm({
        title: "¿Estás seguro?",
        content:
          "Si cierras este modal, perderás los cambios que has realizado en el formulario.",
        okText: "Sí, cerrar",
        cancelText: "Cancelar",
        onOk: () => {
          setOpen(false);
          form.resetFields();
          setIsEditing(false);
          setEditingUser(null);
          setImageUrl('')
        },
      });
    } else {
      // Si no hay cambios, simplemente cerrar el modal
      setOpen(false);
      form.resetFields();
      setIsEditing(false);
      setEditingUser(null);
      setImageUrl('')

    }
  };

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      const url = URL.createObjectURL(info.file.originFileObj );
      setImageUrl(url);
      setFile(info.file.originFileObj );
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = ({ file, onSuccess }) => {
    setImageUrl(URL.createObjectURL(file));
    setFile(file );
    onSuccess(file);
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
        <div className="col-md-8 linea_separador mb-2 d-flex align-items-center">
          <div
            className="titulo_proyecto"
            style={{ flexBasis: "25%", flexGrow: 0 }}
          >
            <p>Gestión de residentes</p>
          </div>
          <div className="objeto" style={{ flexBasis: "75%", flexGrow: 0 }}>
            <p>
              Administra eficientemente los residentes de cada conjunto cerrado
            </p>
          </div>
        </div>

        <div className="col-md-4 d-flex justify-content-center align-items-center flex-column">
          <h2 className="text-center mb-2">Listado de residentes</h2>
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="input-group shadow-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar Residente..."
                  value={searchTerm} // Vincula el estado de búsqueda al input
                  onChange={handleSearchInputChange} // Maneja el cambio en el input
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  //onClick={handleSearchClick} // Maneja el clic en el botón de búsqueda
                >
                  <SearchOutlined /> {/* Incluye el icono aquí */}
                </button>
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="d-flex justify-content-end mt-2">
                <Button
                  type="primary"
                  className="btn btn-primary me-2"
                  onClick={showModal}
                  size="large"
                  icon={<PlusOutlined />}
                >
                  Nuevo
                </Button>

                <Button
                  type="primary"
                  className="btn btn-primary me-2"
                  //onClick={exportToExcel}
                  size="large"
                  icon={<DownloadOutlined />}
                >
                  Excel
                </Button>
                <Button
                  type="primary"
                  className="btn btn-primary"
                  onClick={clearAllFilters}
                  size="large"
                  icon={<ClearOutlined />}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataUsuarios}
        rowKey="id"
        bordered
        pagination={pagination}
        sortDirections={["ascend", "descend"]}
        loading={loading}
        scroll={{ y: 400, x: "max-content" }}
      />

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
                  {isEditing ? 'Actualizar' : 'Registrar'}
              </Button>
          </Popconfirm>,
      ]}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>

          <Col xs={24} sm={12} md={12} lg={12}>
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
                  <Select>
                                {listaConjuntos.map(conjunto => (
                                    <Option key={conjunto.id} value={conjunto.id}>
                                        {conjunto.nombre}
                                    </Option>
                                ))}
                            </Select>
              </Form.Item>
            </Col>
          <Col xs={24} sm={12} md={12} lg={12}>
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
                  { required: true, message: "Por favor ingrese el apellido" },
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
              <Col xs={12}>
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
              <Col xs={12}>
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
        </Form>
      </Modal>
    </div>
  );
};

export default Residentes;
