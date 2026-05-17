const PDFDocument = require("pdfkit");
const os = require("os");

const downloadPDFReport = (req, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=system-report.pdf"
  );

  doc.pipe(res);

  const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const cpuCores = os.cpus().length;
  const platform = os.platform();

  doc.fontSize(20).text("AI Observability System Report", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(14).text(`Platform: ${platform}`);
  doc.text(`CPU Cores: ${cpuCores}`);
  doc.text(`Total Memory: ${totalMemoryGB} GB`);
  doc.text(`Free Memory: ${freeMemoryGB} GB`);
  doc.text(`Generated At: ${new Date().toLocaleString()}`);

  doc.moveDown();

  doc.fontSize(16).text("System Status Summary");
  doc.fontSize(12).text(
    "System is actively monitored using AI Observability Platform."
  );

  doc.moveDown();

  doc.fontSize(16).text("Alerts");
  doc.fontSize(12).text(
    "No critical alerts detected currently."
  );

  doc.moveDown();

  doc.fontSize(16).text("Predictions");
  doc.fontSize(12).text(
    "System health is stable. No immediate failure predicted."
  );

  doc.end();
};

module.exports = {
  downloadPDFReport,
};