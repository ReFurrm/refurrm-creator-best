// PDF generation utilities using jsPDF
// Note: Assumes jsPDF is available. In production, install with: npm install jspdf

export interface BusinessInfo {
  businessName: string;
  creatorName: string;
  email: string;
  effectiveDate: string;
}

export const generateCreatorRightsPDF = (info: BusinessInfo) => {
  // @ts-expect-error - jsPDF is injected at runtime via window.jspdf
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('PDF library not loaded. Please refresh the page.');
    return;
  }

  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.text('Creator Rights & Ownership', 105, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setFontSize(12);
  doc.text(`For: ${info.businessName}`, 105, yPos, { align: 'center' });
  yPos += 6;
  doc.text(`Creator: ${info.creatorName}`, 105, yPos, { align: 'center' });
  yPos += 6;
  doc.text(`Effective Date: ${info.effectiveDate}`, 105, yPos, { align: 'center' });
  yPos += 15;

  // Content sections
  const addSection = (title: string, content: string[]) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(title, 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    content.forEach(line => {
      const lines = doc.splitTextToSize(line, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5 + 3;
    });
    yPos += 5;
  };

  addSection('Copyright Ownership', [
    `${info.creatorName} retains 100% ownership of all artwork, designs, and creative content uploaded to ReFurrm.`,
    'ReFurrm does not claim any ownership rights to your work.',
    'You can sell your art on other platforms simultaneously and remove content at any time.'
  ]);

  addSection('Profit Sharing', [
    'You keep 100% of your profits. ReFurrm charges transparent subscription fees—not commissions.',
    'ReFurrm commission: $0 (zero). All revenue from sales belongs to the creator.'
  ]);

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`${info.businessName}_Creator_Rights.pdf`);
};
