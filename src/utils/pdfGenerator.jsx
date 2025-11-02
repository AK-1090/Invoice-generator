// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';

export function generatePDF(invoice, companyInfo) {
  const doc = new jsPDF();
  
  // Add company info
  doc.setFontSize(20);
  doc.text(companyInfo.companyName || 'Your Company', 20, 30);
  doc.setFontSize(10);
  doc.text(companyInfo.address || '', 20, 40);
  doc.text(`${companyInfo.email || ''} ${companyInfo.phone || ''}`, 20, 45);
  
  // Invoice title and number
  doc.setFontSize(16);
  doc.text(`INVOICE #${invoice.invoiceNumber}`, 150, 30, { align: 'right' });
  doc.setFontSize(10);
  doc.text(`Date: ${invoice.date}`, 150, 40, { align: 'right' });
  doc.text(`Due Date: ${invoice.dueDate}`, 150, 45, { align: 'right' });
  
  // Client info
  doc.setFontSize(12);
  doc.text('Bill To:', 20, 65);
  doc.text(invoice.clientName, 20, 72);
  doc.text(invoice.clientEmail, 20, 77);
  doc.text(invoice.clientAddress, 20, 82);
  
  // Items table
  let yPosition = 110;
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPosition, 170, 10, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('Description', 22, yPosition + 7);
  doc.text('Qty', 120, yPosition + 7);
  doc.text('Price', 140, yPosition + 7);
  doc.text('Amount', 170, yPosition + 7, { align: 'right' });
  
  yPosition += 10;
  
  // Table rows
  invoice.items.forEach(item => {
    const amount = item.quantity * item.price;
    doc.text(item.description, 22, yPosition + 7);
    doc.text(item.quantity.toString(), 120, yPosition + 7);
    doc.text(`$${item.price.toFixed(2)}`, 140, yPosition + 7);
    doc.text(`$${amount.toFixed(2)}`, 170, yPosition + 7, { align: 'right' });
    yPosition += 10;
  });
  
  // Totals
  yPosition += 20;
  doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 150, yPosition, { align: 'right' });
  yPosition += 7;
  doc.text(`Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2)}`, 150, yPosition, { align: 'right' });
  yPosition += 7;
  doc.text(`Discount (${invoice.discount}%): $${invoice.discountAmount.toFixed(2)}`, 150, yPosition, { align: 'right' });
  yPosition += 7;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: $${invoice.total.toFixed(2)}`, 150, yPosition, { align: 'right' });
  
  // Notes
  if (invoice.notes) {
    yPosition += 20;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('Notes:', 20, yPosition);
    doc.text(invoice.notes, 20, yPosition + 7);
  }
  
  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
}