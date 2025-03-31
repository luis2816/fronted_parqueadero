import React, { useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  table: { display: "table", width: "auto", marginTop: 10 },
  row: { flexDirection: "row" },
  headerCell: {
    backgroundColor: "#4F81BD",
    color: "white",
    padding: 4,
    fontSize: 10, // Letra más pequeña
    fontWeight: "bold",
    border: "1px solid black",
    textAlign: "center",
    flex: 1,
  },
  cell: {
    padding: 4,
    fontSize: 8, // Letra más pequeña
    border: "1px solid black",
    flex: 1,
    wordWrap: "break-word", // Asegura el salto de línea en textos largos
    maxWidth: 80, // Ajuste del tamaño máximo de la celda
  },
});

const PDFDocument = ({ title, headers, keys, data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Título */}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.row}>
          {headers.map((header, index) => (
            <Text key={index} style={styles.headerCell}>{header}</Text>
          ))}
        </View>
        {/* Filas de datos */}
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {keys.map((key, colIndex) => (
              <Text key={colIndex} style={styles.cell}>{String(row[key])}</Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const ExportPDF = ({ title, headers, keys, data, fileName }) => {
  useEffect(() => {
    const generateAndDownloadPDF = async () => {
      const doc = <PDFDocument title={title} headers={headers} keys={keys} data={data} />;
      const pdfBlob = await pdf(doc).toBlob();
      saveAs(pdfBlob, `${fileName}.pdf`);
    };

    generateAndDownloadPDF();
  }, [title, headers, keys, data, fileName]);

  return null; // No renderiza nada, solo genera y descarga el PDF automáticamente
};

export default ExportPDF;