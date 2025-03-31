import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../redux/userSlice";
import { obtenerUsuarioPorId } from "../../services/usuarioServices";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Button,
  Upload,
  Row,
  Col,
  message,
} from "antd";
import Swal from "sweetalert2";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { updateUsuario } from "../../services/usuarioServices";

import moment from "moment";
import "./perfil.css";

const { Option } = Select;

const Perfil = () => {
  const [form] = Form.useForm();
  const [usuario, setUsuario] = useState(null);
  const [imageUrl, setImageUrl] = useState(undefined); // Estado para la URL de la imagen
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const userIdNumber = Number(user.id);
  const dispatch = useDispatch(); // Usa el tipo AppDispatch

  const fetchUsuario = async () => {
    try {
      setLoading(true);
      const usuarioData = await obtenerUsuarioPorId(userIdNumber);
      console.log(usuarioData);
      setUsuario(usuarioData);
      form.setFieldsValue({
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        tipo_identificacion: usuarioData.tipo_identificacion,
        numero_identificacion: usuarioData.numero_identificacion,
        sexo: usuarioData.sexo,
        email: usuarioData.email,
        telefono: usuarioData.telefono,
        fecha_nacimiento: usuarioData.fecha_nacimiento
          ? moment(usuarioData.fecha_nacimiento)
          : null,
        rol_id: usuarioData.rol_id,
        cantidad_licencia: usuarioData.cantidad_licencia,
        rol: usuarioData.rol,
      });
      const url_foto =
        usuarioData.foto_perfil_url + `?timestamp=${new Date().getTime()}`;
      console.log(url_foto);
      setImageUrl(url_foto); // Asume que `usuarioData.avatar` contiene la URL de la imagen
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsuario();
    }
  }, [user, form]);

  const onFinish = async (values) => {
    try {
      // Formatea la fecha de nacimiento al formato "YYYY-MM-DD"
      let formattedValues = {
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
      const response = await updateUsuario(userIdNumber, formData); // Asegúrate de que updateUsuario maneje FormData

      switch (response.status) {
        case 200:
          dispatch(fetchUserData(userIdNumber));
          fetchUsuario(); // Refrescar los datos
          Swal.fire({
            title: "Usuario actualizado",
            text: "Los datos se han guardado correctamente.",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          break;

        case 401:
          Swal.fire({
            title: "Acceso denegado",
            text: response.msg || "No tienes autorización para esta acción.",
            icon: "warning",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          break;

        case 500:
          Swal.fire({
            title: "Error del servidor",
            text: "Ha ocurrido un error inesperado. Intenta nuevamente.",
            icon: "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          break;

        default:
          Swal.fire({
            title: "Error desconocido",
            text: "Algo salió mal. Por favor, inténtalo más tarde.",
            icon: "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          break;
      }
    } catch (error) {
      Swal.fire({
        title: "Error inesperado",
        text: "Ha ocurrido un error inesperado. Inténtalo nuevamente.",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
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

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Solo puedes subir archivos JPG/PNG.");
    }
    return isJpgOrPng;
  };
  return (
    <div className="container mt-5">
      <div className="row mb-4 d-flex align-items-center justify-content-center">
        <div className="col-md-8 linea_separador mb-4">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div
              className="titulo_proyecto"
              style={{ borderRight: "0px", flexGrow: 0 }}
            >
              <p className="font-weight-bold mb-0">Gestionar perfil</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
                  <Input type="number" />
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
                  <Input disabled={true} />
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
                  name="rol"
                  label="Rol"
                  rules={[
                    { required: true, message: "Por favor seleccione un rol" },
                  ]}
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label="Cantidad de Licencias"
                  name="cantidad_licencia"
                >
                  <Input type="number" disabled={true} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className="mb-4">
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                className="d-flex justify-content-center"
              >
                <Form.Item
                  label="Foto de Perfil"
                  name="avatar"
                  className="text-center"
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    customRequest={customRequest}
                    beforeUpload={beforeUpload}
                    onChange={handleUploadChange}
                    className="upload-avatar"
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" className="avatar-img" />
                    ) : (
                      <div className="upload-placeholder">
                        {loading ? <LoadingOutlined /> : <UploadOutlined />}
                        <div style={{ marginTop: 8 }}>Subir Imagen</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="d-flex justify-content-center">
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
