import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, position, salary } = req.body;

      // Create a new PDF document
      const doc = new PDFDocument();

      // Set response headers to trigger download
      res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');
      res.setHeader('Content-Type', 'application/pdf');

      // Pipe the PDF to the response
      doc.pipe(res);

      // Add content to the PDF
      doc.fontSize(25).text('Payment Receipt', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text(`Name: ${name}`);
      doc.text(`Position: ${position}`);
      doc.text(`Salary: $${salary}`);
      doc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating PDF' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
