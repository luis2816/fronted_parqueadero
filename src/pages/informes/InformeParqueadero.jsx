import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Card, Select, Table, Col, Row, Tag , DatePicker, Button} from "antd";
import { ReloadOutlined} from "@ant-design/icons";


import "chart.js/auto";

const { RangePicker } = DatePicker;
const cardStyle = {
    textAlign: "center",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    padding: 20,
    height: "90%",
};

const iconContainerStyle = {
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: "#F44336",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 10px",
};

const iconStyle = {
    fontSize: 40,
    color: "white",
};

const total = {
    fontSize: 30, color: "#333", margin: 0
}

const datosSimulados = {
    dias: ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb", "07 Feb"],
    ingresos: [35, 50, 40, 60, 55, 70, 65],
    salidas: [30, 45, 35, 55, 50, 65, 60],
    horas: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    ocupacionPorHora: [20, 35, 50, 70, 65, 80, 60, 40],
    duracionPorDia: [110, 95, 130, 140, 120, 150, 135],
    ocupacionTiempoReal: [5, 10, 15, 20, 18, 25, 30, 28],
    apartamentos: ["101", "102", "201", "202", "301", "302"],
    registros: [
        { placa: "ABC123", horaIngreso: "08:00", horaSalida: "12:00", espacio: "A1", apartamento: "101" },
        { placa: "XYZ456", horaIngreso: "09:30", horaSalida: "14:15", espacio: "B2", apartamento: "202" },
        { placa: "LMN789", horaIngreso: "10:00", horaSalida: "16:00", espacio: "C3", apartamento: "301" },
    ],
};

const InformeParqueadero = () => {
    const [filtroApartamento, setFiltroApartamento] = useState(null);
    const [rangoHoras, setRangoHoras] = useState(null);

    const columnasTabla = [
        { title: "Placa", dataIndex: "placa", key: "placa" },
        { title: "Hora de Ingreso", dataIndex: "horaIngreso", key: "horaIngreso" },
        { title: "Hora de Salida", dataIndex: "horaSalida", key: "horaSalida" },
        { title: "Espacio", dataIndex: "espacio", key: "espacio" },
        { title: "Apartamento", dataIndex: "apartamento", key: "apartamento" },
    ];

    return (
        <Card style={{ padding: 20 }}>
            <Tag
                color="#D0E0F2"
                style={{
                    color: "#145BAD",
                    fontSize: "25px",
                    fontWeight: "bold",
                    padding: "8px 15px",
                    borderRadius: "8px",
                    textAlign: "center",
                    display: "block",
                    marginBottom: "15px"
                }}
            >
                INFORME DE USO DEL PARQUEADERO
            </Tag>
      {/* Filtros */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={6} md={8}>
          <Select
            placeholder="Selecciona apartamento"
            style={{ width: "100%" }}>
        
          </Select>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <RangePicker
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={2}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
          >
            Restablecer
          </Button>
        </Col>


      </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8} md={12}>
                    <Card
                        style={{
                            position: "relative",
                            borderRadius: 20,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            paddingTop: "30px",
                            marginTop: "20px",
                        }}>
                        <div
                            style={{
                                width: "100%", // 📌 Ocupar el ancho del padre
                                height: "400px",
                                overflowX: "auto", // 📌 Habilita el scroll si es necesario
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Line
                                data={{
                                    labels: datosSimulados.dias,
                                    datasets: [
                                        {
                                            label: "Vehículos ingresados",
                                            data: datosSimulados.ingresos,
                                            borderColor: "rgba(75, 192, 192, 0.6)",
                                            fill: false,
                                        },
                                        {
                                            label: "Vehículos salidos",
                                            data: datosSimulados.salidas,
                                            borderColor: "rgba(255, 99, 132, 0.6)",
                                            fill: false,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: "Tendencia de Ingresos y Salidas",
                                            font: { size: 18, weight: "bold" },
                                            color: "#0B3360",
                                            padding: { top: 5, bottom: 30 },

                                        },
                                        legend: {
                                            display: true,
                                            position: "bottom", // 📌 Coloca la leyenda debajo de la gráfica
                                            labels: {
                                                font: { size: 14, weight: "bold" },
                                                padding: 10,
                                            },
                                        },
                                        datalabels: {
                                            display: true,
                                            color: "#000",
                                            font: { weight: "bold", size: 16 },
                                        },
                                    }
                                }}
                                height={100}
                            />

                        </div>

                    </Card>
                </Col>

                <Col xs={24} sm={8} md={12}>
                    <Card
                        style={{
                            position: "relative",
                            borderRadius: 20,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            paddingTop: "30px",
                            marginTop: "20px",
                        }}>
                        <div
                            style={{
                                width: "100%", // 📌 Ocupar el ancho del padre
                                height: "400px",
                                overflowX: "auto", // 📌 Habilita el scroll si es necesario
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <Bar
                                data={{
                                    labels: datosSimulados.horas,
                                    datasets: [
                                        {
                                            label: "Espacios ocupados",
                                            data: datosSimulados.ocupacionPorHora,
                                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: "Promedio de Ocupación por Hora",
                                            font: { size: 18, weight: "bold" },
                                            color: "#0B3360",
                                            padding: { top: 5, bottom: 30 },

                                        },
                                        legend: {
                                            display: true,
                                            position: "bottom", // 📌 Coloca la leyenda debajo de la gráfica
                                            labels: {
                                                font: { size: 14, weight: "bold" },
                                                padding: 10,
                                            },
                                        },
                                        datalabels: {
                                            display: true,
                                            color: "#000",
                                            font: { weight: "bold", size: 16 },
                                        },
                                    }
                                }}
                                height={100}
                            />

                        </div>

                    </Card>


                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8} md={12}>
                    <Card
                        style={{
                            position: "relative",
                            borderRadius: 20,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            paddingTop: "30px",
                            marginTop: "20px",
                        }}>
                        <div
                            style={{
                                width: "100%", // 📌 Ocupar el ancho del padre
                                height: "400px",
                                overflowX: "auto", // 📌 Habilita el scroll si es necesario
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Bar
                                data={{
                                    labels: datosSimulados.dias,
                                    datasets: [
                                        {
                                            label: "Tiempo promedio de estadía (minutos)",
                                            data: datosSimulados.duracionPorDia,
                                            backgroundColor: "rgba(255, 159, 64, 0.6)",
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: "Duración Promedio de Estadía por Día",
                                            font: { size: 18, weight: "bold" },
                                            color: "#0B3360",
                                            padding: { top: 5, bottom: 30 },

                                        },
                                        legend: {
                                            display: true,
                                            position: "bottom", // 📌 Coloca la leyenda debajo de la gráfica
                                            labels: {
                                                font: { size: 14, weight: "bold" },
                                                padding: 10,
                                            },
                                        },
                                        datalabels: {
                                            display: true,
                                            color: "#000",
                                            font: { weight: "bold", size: 16 },
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: "Minutos",
                                            },
                                        },
                                        x: {
                                            title: {
                                                display: true,
                                                text: "Días",
                                            },
                                        },
                                    },
                                }}
                                height={100}
                            />

                        </div>

                    </Card>

                </Col>

                <Col xs={24} sm={8} md={12}>
                    <Card
                        style={{
                            position: "relative",
                            borderRadius: 20,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            paddingTop: "30px",
                            marginTop: "20px",
                        }}>
                        <div
                            style={{
                                width: "100%", // 📌 Ocupar el ancho del padre
                                height: "400px",
                                overflowX: "auto", // 📌 Habilita el scroll si es necesario
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <Bar
                                data={{
                                    labels: datosSimulados.horas,
                                    datasets: [
                                        {
                                            label: "Espacios ocupados",
                                            data: datosSimulados.ocupacionTiempoReal,
                                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: "Historial de Ocupación en Tiempo Real",
                                            font: { size: 18, weight: "bold" },
                                            color: "#0B3360",
                                            padding: { top: 5, bottom: 30 },

                                        },
                                        legend: {
                                            display: true,
                                            position: "bottom", // 📌 Coloca la leyenda debajo de la gráfica
                                            labels: {
                                                font: { size: 14, weight: "bold" },
                                                padding: 10,
                                            },
                                        },
                                        datalabels: {
                                            display: true,
                                            color: "#000",
                                            font: { weight: "bold", size: 16 },
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: "Espacios ocupados",
                                            },
                                        },
                                        x: {
                                            title: {
                                                display: true,
                                                text: "Horas del día",
                                            },
                                        },
                                    },
                                }}
                                height={200}
                            />
                        </div>

                    </Card>
                </Col>
            </Row>


            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8} md={24}>
                    <Card>
                        <Tag
                            color="#D0E0F2"
                            style={{
                                color: "#145BAD",
                                fontSize: "15px",
                                fontWeight: "bold",
                                padding: "8px 15px",
                                borderRadius: "8px",
                                textAlign: "center",
                                display: "block",
                                marginBottom: "15px"
                            }}
                        >
                            Registros de Ingresos y Salidas
                        </Tag>
                        <Table dataSource={datosSimulados.registros} columns={columnasTabla} rowKey="placa" />
                    </Card>
                </Col>
            </Row>

        </Card>

    );
};

export default InformeParqueadero;
