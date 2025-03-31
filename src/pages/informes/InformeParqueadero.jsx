import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Card, Select, Table, Col, Row, Tag, DatePicker, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import "chart.js/auto";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

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
  fontSize: 30,
  color: "#333",
  margin: 0,
};

const datosSimulados = {
  dias: ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb", "07 Feb"],
  ingresos: [35, 50, 40, 60, 55, 70, 65],
  salidas: [30, 45, 35, 55, 50, 65, 60],
  horas: [
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
  ],
  ocupacionPorHora: [20, 35, 50, 70, 65, 80, 60, 40],
  duracionPorDia: [110, 95, 130, 140, 120, 150, 135],
  ocupacionTiempoReal: [5, 10, 15, 20, 18, 25, 30, 28],
  apartamentos: ["101", "102", "201", "202", "301", "302"],
  registros: [
    {
      placa: "AAA123",
      horaIngreso: "07:30",
      horaSalida: "11:45",
      espacio: "A1",
      apartamento: "101",
    },
    {
      placa: "XYZ456",
      horaIngreso: "08:15",
      horaSalida: "13:00",
      espacio: "B2",
      apartamento: "202",
    },
    {
      placa: "LMN789",
      horaIngreso: "09:00",
      horaSalida: "14:30",
      espacio: "C3",
      apartamento: "303",
    },
    {
      placa: "DEF321",
      horaIngreso: "10:20",
      horaSalida: "15:40",
      espacio: "A2",
      apartamento: "102",
    },
    {
      placa: "GHI654",
      horaIngreso: "11:10",
      horaSalida: "16:20",
      espacio: "B3",
      apartamento: "204",
    },
    {
      placa: "JKL987",
      horaIngreso: "12:00",
      horaSalida: "17:15",
      espacio: "C1",
      apartamento: "305",
    },
    {
      placa: "MNO258",
      horaIngreso: "06:45",
      horaSalida: "10:50",
      espacio: "A3",
      apartamento: "103",
    },
    {
      placa: "PQR369",
      horaIngreso: "07:55",
      horaSalida: "12:30",
      espacio: "B1",
      apartamento: "206",
    },
    {
      placa: "STU147",
      horaIngreso: "09:20",
      horaSalida: "14:00",
      espacio: "C2",
      apartamento: "307",
    },
    {
      placa: "VWX258",
      horaIngreso: "10:35",
      horaSalida: "15:50",
      espacio: "A4",
      apartamento: "104",
    },
    {
      placa: "YZA369",
      horaIngreso: "11:45",
      horaSalida: "17:10",
      espacio: "B4",
      apartamento: "208",
    },
    {
      placa: "BCD753",
      horaIngreso: "08:25",
      horaSalida: "13:45",
      espacio: "C4",
      apartamento: "309",
    },
    {
      placa: "EFG852",
      horaIngreso: "09:40",
      horaSalida: "14:55",
      espacio: "A5",
      apartamento: "105",
    },
    {
      placa: "HIJ963",
      horaIngreso: "07:10",
      horaSalida: "11:30",
      espacio: "B5",
      apartamento: "210",
    },
    {
      placa: "KLM741",
      horaIngreso: "10:05",
      horaSalida: "16:35",
      espacio: "C5",
      apartamento: "311",
    },
  ],
};

const InformeParqueadero = () => {
  const [filtroApartamento, setFiltroApartamento] = useState(null);
  const [rangoHoras, setRangoHoras] = useState(null);

  const columnasTabla = [
    {
      title: "Placa",
      dataIndex: "placa",
      key: "placa",
      width: 50,
      align: "center",
    },
    {
      title: "Hora de Ingreso",
      dataIndex: "horaIngreso",
      key: "horaIngreso",
      width: 50,
      align: "center",
    },
    {
      title: "Hora de Salida",
      dataIndex: "horaSalida",
      key: "horaSalida",
      width: 50,
      align: "center",
    },
    {
      title: "Espacio",
      dataIndex: "espacio",
      key: "espacio",
      width: 100,
      align: "center",
    },
    {
      title: "Apartamento",
      dataIndex: "apartamento",
      key: "apartamento",
      width: 50,
      align: "center",
    },
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
          marginBottom: "15px",
        }}
      >
        INFORME DE USO DEL PARQUEADERO
      </Tag>
      {/* Filtros */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={6} md={8}>
          <Select
            placeholder="Selecciona apartamento"
            style={{ width: "100%" }}
          ></Select>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <RangePicker style={{ width: "100%" }} />
        </Col>
        <Col xs={24} sm={12} md={2}>
          <Button type="primary" icon={<ReloadOutlined />}>
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
            }}
          >
            <div
              style={{
                width: "100%", // 📌 Ocupar el ancho del padre
                height: "300px",
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
            }}
          >
            <div
              style={{
                width: "100%", // 📌 Ocupar el ancho del padre
                height: "300px",
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
                  },
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
            }}
          >
            <div
              style={{
                width: "100%", // 📌 Ocupar el ancho del padre
                height: "300px",
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
            }}
          >
            <div
              style={{
                width: "100%", // 📌 Ocupar el ancho del padre
                height: "200px",
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
                marginBottom: "15px",
              }}
            >
              Registros de Ingresos y Salidas
            </Tag>
            <Table
              dataSource={datosSimulados.registros}
              columns={columnasTabla}
              rowKey="placa"
              pagination={{ pageSize: 20 }}
              bordered
              scroll={{ y: 500, x: "max-content" }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default InformeParqueadero;
