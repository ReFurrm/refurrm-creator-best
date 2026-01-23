// Privacy Policy PDF generator
import { BusinessInfo } from './pdfGenerator';

export const generatePrivacyPDF = (info: BusinessInfo) => {
  // @ts-expect-error - jsPDF is injected at runtime via window.jspdf
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('PDF library not loaded. Please refresh the page.');
    return;
  }

  const doc = new jsPDF();
  let yPos = 20;

  doc.setFontSize(24);
  doc.text('Privacy Policy', 105, yPos, { align: 'center' });
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

  addSection('1. Information We Collect', [
    'We collect information you provide directly: account information (name, email, password), payment information, content you upload, and store/product information.',
    'We also collect usage data automatically: device information, IP address, browser type, pages visited, and performance logs.'
  ]);

  addSection('2. How We Use Your Information', [
    'We use your information to provide and improve our AI-powered services, process uploads, manage accounts, process payments, send notifications, analyze usage, prevent fraud, and comply with legal obligations.'
  ]);

  addSection('3. Data Storage and Security', [
    'Your data is stored securely using Supabase infrastructure with industry-standard encryption. We implement encrypted data transmission (HTTPS/TLS), secure authentication, regular security audits, and access controls.'
  ]);

  addSection('4. Your Rights', [
    'You have the right to access your personal data, correct inaccurate information, request deletion, export your data, opt out of marketing, and withdraw consent for data processing.'
  ]);

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`${info.businessName}_Privacy_Policy.pdf`);
};
