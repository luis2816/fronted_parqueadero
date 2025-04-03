import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import "./parkin.css";

const ParkingReport = ({ parkingData }) => {
  if (!parkingData || !parkingData.success)
    return <div>No hay datos disponibles</div>;

  const { conjunto, detalle, ocupados_actuales, parkingSpaces, totalSpaces } =
    parkingData;

  // Datos para gráficos
  const availableSpaces = totalSpaces - Object.keys(ocupados_actuales).length;
  const apartmentUsage = {};
  const hourlyUsage = Array(24).fill(0);
  const plateFrequency = {};

  detalle.forEach((entry) => {
    // Uso por apartamento
    apartmentUsage[entry.apartamento] =
      (apartmentUsage[entry.apartamento] || 0) + 1;

    // Uso por hora del día
    const hour = new Date(entry.fecha_hora).getHours();
    hourlyUsage[hour]++;

    // Frecuencia de placas
    plateFrequency[entry.placa] = (plateFrequency[entry.placa] || 0) + 1;
  });

  // Gráfico 1: Disponibilidad actual
  const availabilityData = {
    labels: ["Ocupados", "Disponibles"],
    datasets: [
      {
        label: "Parqueaderos",
        data: [Object.keys(ocupados_actuales).length, availableSpaces],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  // Gráfico 2: Uso por apartamento
  const apartmentData = {
    labels: Object.keys(apartmentUsage),
    datasets: [
      {
        label: "Usos por apartamento",
        data: Object.values(apartmentUsage),
        backgroundColor: "#4BC0C0",
        borderColor: "#4BC0C0",
        borderWidth: 1,
      },
    ],
  };

  // Gráfico 3: Uso por hora del día
  const hourlyData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Usos por hora",
        data: hourlyUsage,
        fill: false,
        backgroundColor: "#9966FF",
        borderColor: "#9966FF",
        tension: 0.1,
      },
    ],
  };

  // Gráfico 4: Placas más frecuentes
  const sortedPlates = Object.entries(plateFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const plateData = {
    labels: sortedPlates.map(([plate]) => plate),
    datasets: [
      {
        label: "Usos por placa",
        data: sortedPlates.map(([_, count]) => count),
        backgroundColor: "#FF9F40",
      },
    ],
  };

  return (
    <div className="parking-report">
      <h1 className="report-title">
        Informe de Parqueaderos - {conjunto.nombre}
      </h1>
      <div className="report-summary">
        <p>Total de parqueaderos: {conjunto.total_parqueaderos}</p>
        <p>Ocupados actualmente: {Object.keys(ocupados_actuales).length}</p>
        <p>Disponibles: {availableSpaces}</p>
      </div>

      <div className="chart-container">
        <div className="chart">
          <h3>Disponibilidad Actual</h3>
          <Pie data={availabilityData} />
        </div>

        <div className="chart">
          <h3>Uso por Apartamento</h3>
          <Bar
            data={apartmentData}
            options={{ scales: { y: { beginAtZero: true } } }}
          />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart">
          <h3>Patrones de Uso por Hora del Día</h3>
          <Line data={hourlyData} />
        </div>

        <div className="chart">
          <h3>Vehículos más Frecuentes (Top 5)</h3>
          <Bar
            data={plateData}
            options={{ scales: { y: { beginAtZero: true } } }}
          />
        </div>
      </div>

      <div className="current-occupancy">
        <h3>Parqueaderos Ocupados Actualmente</h3>
        <table>
          <thead>
            <tr>
              <th>Parqueadero</th>
              <th>Apartamento</th>
              <th>Placa</th>
              <th>Nombre</th>
              <th>Hora de Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(ocupados_actuales).map((parking, index) => (
              <tr key={index}>
                <td>{parking.parqueadero}</td>
                <td>{parking.apartamento}</td>
                <td>{parking.placa}</td>
                <td>{parking.nombre}</td>
                <td>{new Date(parking.fecha_hora).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParkingReport;
