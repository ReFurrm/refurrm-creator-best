// Terms of Service PDF generator
import { BusinessInfo } from './pdfGenerator';

export const generateTermsPDF = (info: BusinessInfo) => {
  // @ts-expect-error - jsPDF is injected at runtime via window.jspdf
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('PDF library not loaded. Please refresh the page.');
    return;
  }

  const doc = new jsPDF();
  let yPos = 20;

  doc.setFontSize(24);
  doc.text('Terms of Service', 105, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setFontSize(12);
  doc.text(`${info.businessName}`, 105, yPos, { align: 'center' });
  yPos += 6;
  doc.text(`Effective Date: ${info.effectiveDate}`, 105, yPos, { align: 'center' });
  yPos += 15;

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

  addSection('1. Overview', [
    `${info.businessName} is an AI-assisted creation and publishing platform. Users upload files, ideas, artwork, or voice notes. The system generates digital products, mockups, marketing assets, and related content.`
  ]);

  addSection('2. Eligibility', [
    'You must be at least 18 years old to use this platform. Minors require direct supervision from a legal guardian.'
  ]);

  addSection('3. User Content', [
    'You retain full ownership of the content you upload. By uploading, you grant a limited license to process and deliver your content through AI systems.',
    'You agree that your content will not infringe on intellectual property rights, contain illegal material, or promote violence.'
  ]);

  addSection('4. AI Generated Content', [
    'AI output is generated automatically based on your uploads. You are responsible for reviewing accuracy and legality before publishing.'
  ]);

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`${info.businessName}_Terms_of_Service.pdf`);
};
