// src/pages/PreviewInvoice.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Download, ArrowLeft } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

export default function PreviewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useInvoice();
  
  const invoice = state.invoices.find(inv => inv.id === id);
  const { userProfile } = state;

  if (!invoice) {
    return (
      <div className="error-page">
        <h2>Invoice not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    generatePDF(invoice, userProfile);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="preview-invoice">
      <div className="preview-header">
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="preview-actions">
          <button onClick={handleDownloadPDF} className="btn btn-primary">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="invoice-preview">
        <div className="invoice-header">
          <div className="company-info">
            <h2>{userProfile.companyName || 'Your Company'}</h2>
            <p>{userProfile.address}</p>
            <p>{userProfile.email} | {userProfile.phone}</p>
            {userProfile.taxId && <p>Tax ID: {userProfile.taxId}</p>}
          </div>
          <div className="invoice-meta">
            <h1>INVOICE #{invoice.invoiceNumber}</h1>
            <div className="invoice-dates">
              <p><strong>Date:</strong> {invoice.date}</p>
              <p><strong>Due Date:</strong> {invoice.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="client-info">
          <h3>Bill To:</h3>
          <p><strong>{invoice.clientName}</strong></p>
          <p>{invoice.clientEmail}</p>
          <p>{invoice.clientAddress}</p>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="totals-grid">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="total-row">
              <span>Tax ({invoice.taxRate}%):</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="total-row">
              <span>Discount ({invoice.discount}%):</span>
              <span>{formatCurrency(invoice.discountAmount)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="invoice-notes">
            <h3>Notes</h3>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}