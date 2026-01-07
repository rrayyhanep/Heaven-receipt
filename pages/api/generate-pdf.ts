
import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';
import { db } from '../../lib/firebase'; // Import the Firestore database instance

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    employeeId,
    monthYear,
    advance = 0, // Default to 0 if not provided
    leaveDeduction = 0, // Default to 0 if not provided
  } = req.body;

  if (!employeeId || !monthYear) {
    return res.status(400).send('Missing required fields: employeeId and monthYear');
  }

  try {
    // 1. Fetch employee data from Firestore
    const employeeDocRef = db.collection('employees').doc(employeeId);
    const employeeDoc = await employeeDocRef.get();

    if (!employeeDoc.exists) {
      return res.status(404).send('Employee not found');
    }

    const employeeData = employeeDoc.data();
    const {
      name: employeeName,
      basicSalary = 0,
      pendingBalance = 0
    } = employeeData || {};

    // 2. Perform salary calculations on the server
    const totalSalary = basicSalary - leaveDeduction;
    const netSalary = totalSalary - advance;
    const balanceToReceive = netSalary + pendingBalance;

    // 3. Update the employee's pending balance in Firestore for the next cycle
    await employeeDocRef.update({ pendingBalance: balanceToReceive });

    // 4. Generate the PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=salary_slip_${employeeName.replace(/ /g, '_')}_${monthYear}.pdf`);
    doc.pipe(res);

    // --- PDF Content Generation (using server-calculated values) ---
    const pageLeft = 50;
    const pageRight = 545;
    const contentWidth = pageRight - pageLeft;
    let y = 50;

    doc.font('Helvetica-Bold').fontSize(20).text('SALARY SLIP', { align: 'center' });
    y += 35;
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 20;

    doc.font('Helvetica').fontSize(12);
    doc.text(`Company Name: Heaven Furniture`, pageLeft, y);
    doc.text(`Month & Year: ${monthYear}`, { align: 'right' });
    y += 35;

    doc.font('Helvetica-Bold').fontSize(14).text('Employee Details', pageLeft, y);
    y += 20;
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 15;

    doc.font('Helvetica').fontSize(12).text(`Employee Name: ${employeeName}`, pageLeft, y);
    y += 35;

    doc.font('Helvetica-Bold').fontSize(14).text('Earnings & Deductions', pageLeft, y);
    y += 20;
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 10;

    const tableTop = y;
    const rowHeight = 25;
    const col1X = pageLeft;
    const col2X = pageLeft + contentWidth * (2.66 / 3.66);

    doc.rect(col1X, tableTop, contentWidth, rowHeight).fill('#7a9cc6');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12);
    doc.text('Particulars', col1X + 10, tableTop + 7);
    doc.text('Amount (Rs.)', col2X + 10, tableTop + 7);
    y += rowHeight;

    const fields = [
        { label: 'Basic Salary', value: basicSalary.toFixed(2) },
        { label: 'Old Balance', value: pendingBalance.toFixed(2) },
        { label: 'Advance Taken', value: advance.toFixed(2) },
        { label: 'Leave Deduction', value: leaveDeduction.toFixed(2) },
        { label: 'Total Salary (Basic - Leave)', value: totalSalary.toFixed(2) },
        { label: 'Net Salary (Total - Advance)', value: netSalary.toFixed(2) },
        { label: 'Balance to Receive (Net + Old Balance)', value: balanceToReceive.toFixed(2) },
    ];
    
    doc.fillColor('#000000').font('Helvetica').fontSize(12);

    fields.forEach(({ label, value }) => {
      doc.text(label, col1X + 10, y + 7);
      doc.text(value, col2X + 10, y + 7, { align: 'right', width: contentWidth - col2X - 10 });
      y += rowHeight;
    });
    
    const tableBottom = y;

    doc.strokeColor('#000000').lineWidth(0.8);
    doc.rect(col1X, tableTop, contentWidth, tableBottom - tableTop).stroke();
    doc.moveTo(col2X, tableTop).lineTo(col2X, tableBottom).stroke();
    for (let i = 0; i <= fields.length; i++) {
      const lineY = tableTop + rowHeight * i;
      doc.moveTo(col1X, lineY).lineTo(pageRight, lineY).stroke();
    }

    y = tableBottom + 50;

    doc.font('Helvetica').fontSize(12);
    doc.text('Employee Signature: _________________', pageLeft, y);
    doc.text('Authorized Signature: _________________', { align: 'right' });

    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).send('Error generating PDF');
  }
};
