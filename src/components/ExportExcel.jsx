import React, { useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportExcel = ({ headers, keys, data, fileName, onExportComplete }) => {
  useEffect(() => {
    const generateExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");

      // Agregar encabezados con estilos
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" }, // Color de fondo azul
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Agregar datos según las claves proporcionadas
      data.forEach((row) => {
        const dataRow = worksheet.addRow(keys.map((key) => row[key]));
        dataRow.eachCell((cell) => {
          cell.font = { size: 11 };
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Ajustar el ancho de las columnas automáticamente
      worksheet.columns.forEach((column) => {
        column.width = headers[column.number - 1].length + 5;
      });

      // Crear el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.xlsx`);

      // Notificar que la exportación ha terminado
      if (onExportComplete) {
        onExportComplete();
      }
    };

    generateExcel();
  }, [headers, keys, data, fileName, onExportComplete]);

  return null; // No renderiza nada, solo ejecuta la descarga
};

export default ExportExcel;
