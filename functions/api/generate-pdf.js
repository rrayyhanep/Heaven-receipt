import PDFDocument from 'pdfkit';

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(`Method ${context.request.method} Not Allowed`, {
      status: 405,
      headers: {
        'Allow': 'POST',
      },
    });
  }

  try {
    const {
      monthYear,
      employeeName,
      basicSalary,
      pendingBalance,
      advance,
      leaveDeduction,
      totalSalary,
      balanceToReceive,
      netSalary,
    } = await context.request.json();

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Create a buffer to store the PDF data
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Define constants for layout
    const pageLeft = 50;
    const pageRight = 545; // Page width (595) - margin (50)
    const contentWidth = pageRight - pageLeft;

    let y = 50;

    // Title
    doc.font('Helvetica-Bold').fontSize(20).text('SALARY SLIP', pageLeft, y, { align: 'center', width: contentWidth });
    y += 35;

    // Line
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 20;

    // Company & Month
    const companyName = "Heaven Furniture";
    const displayMonthYear = monthYear || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    doc.font('Helvetica').fontSize(12);
    doc.text(`Company Name: ${companyName}`, pageLeft, y);
    doc.text(`Month & Year: ${displayMonthYear}`, pageLeft, y, { align: 'right', width: contentWidth });
    y += 35;

    // Employee Details Heading
    doc.font('Helvetica-Bold').fontSize(14).text('Employee Details', pageLeft, y);
    y += 20;
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 15;

    // Employee Name
    doc.font('Helvetica').fontSize(12).text(`Employee Name: ${employeeName}`, pageLeft, y);
    y += 35;

    // Earnings & Deductions Heading
    doc.font('Helvetica-Bold').fontSize(14).text('Earnings & Deductions', pageLeft, y);
    y += 20;
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 10;

    // Table
    const tableTop = y;
    const rowHeight = 25;
    const col1X = pageLeft;
    const col2X = pageLeft + contentWidth * (2.66 / 3.66); // Correctly proportioned column

    // Table Header
    doc.rect(col1X, tableTop, contentWidth, rowHeight).fill('#7a9cc6');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12);
    doc.text('Particulars', col1X + 10, tableTop + 7);
    doc.text('Amount (Rs.)', col2X + 10, tableTop + 7);
    y += rowHeight;

    const fields = [
        { label: 'Basic Salary', value: basicSalary },
        { label: 'Old Balance', value: pendingBalance },
        { label: 'Advance Taken', value: advance },
        { label: 'Leave Deduction', value: leaveDeduction },
        { label: 'Net Salary', value: netSalary },
        { label: 'Total Salary', value: totalSalary },
        { label: 'Balance to Receive', value: balanceToReceive },
      ];
      
    doc.fillColor('#000000').font('Helvetica').fontSize(12);

    fields.forEach(({ label, value }) => {
      doc.text(label, col1X + 10, y + 7);
      doc.text(String(value), col2X + 10, y + 7);
      y += rowHeight;
    });
      
    const tableBottom = y;

    // Table borders
    doc.strokeColor('#000000').lineWidth(0.8);
    doc.rect(col1X, tableTop, contentWidth, tableBottom - tableTop).stroke(); // Outer rectangle
    doc.moveTo(col2X, tableTop).lineTo(col2X, tableBottom).stroke(); // Vertical line
    for (let i = 0; i <= fields.length; i++) {
      const lineY = tableTop + rowHeight * i;
      doc.moveTo(col1X, lineY).lineTo(pageRight, lineY).stroke();
    }

    y = tableBottom + 30;

    // Total Payable Heading
    doc.font('Helvetica-Bold').fontSize(14).text('Total Payable', pageLeft, y);
    y += 20;
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 15;
      
    // Total Salary & Balance
    doc.font('Helvetica').fontSize(12);
    doc.text(`Total Salary: ${totalSalary}`, pageLeft, y);
    y += 20;
    doc.text(`Balance to Receive: ${balanceToReceive}`, pageLeft, y);
    y += 35;

    // Signatures Heading
    doc.font('Helvetica-Bold').fontSize(14).text('Signatures', pageLeft, y);
    y += 20;
    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();
    y += 30;
      
    // Signature lines
    doc.font('Helvetica').fontSize(12);
    doc.text('Employee Signature: _________________', pageLeft, y);
    const secondSig = 'Authorized Signature: _________________';
    const secondSigWidth = doc.widthOfString(secondSig);
    doc.text(secondSig, pageRight - secondSigWidth, y);
    y += 30;

    doc.strokeColor('#000000').lineWidth(1).moveTo(pageLeft, y).lineTo(pageRight, y).stroke();

    return new Promise((resolve) => {
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(new Response(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=salary_slip.pdf',
                },
            }));
        });
        doc.end();
    });

  } catch (error) {
    console.error(error);
    return new Response('Error generating PDF', { status: 500 });
  }
}