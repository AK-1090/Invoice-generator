// src/pages/Dashboard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Search, Plus, Eye, Trash2, FileText } from 'lucide-react';

export default function Dashboard() {
  const { state, dispatch } = useInvoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredInvoices = state.invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || invoice.date.includes(filterDate);
    return matchesSearch && matchesDate;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch({ type: 'DELETE_INVOICE', payload: id });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Invoice Dashboard</h1>
        <Link to="/create" className="btn btn-primary">
          <Plus size={18} />
          New Invoice
        </Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-filter"
        />
      </div>

      <div className="invoices-grid">
        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No invoices found</h3>
            <p>Create your first invoice to get started</p>
            <Link to="/create" className="btn btn-primary">
              Create Invoice
            </Link>
          </div>
        ) : (
          filteredInvoices.map(invoice => (
            <div key={invoice.id} className="invoice-card">
              <div className="invoice-header">
                <h3>INV-{invoice.invoiceNumber}</h3>
                <span className={`status ${invoice.status}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="invoice-details">
                <p><strong>Client:</strong> {invoice.clientName}</p>
                <p><strong>Date:</strong> {invoice.date}</p>
                <p><strong>Due Date:</strong> {invoice.dueDate}</p>
                <p><strong>Total:</strong> {formatCurrency(invoice.total)}</p>
              </div>
              <div className="invoice-actions">
                <Link to={`/preview/${invoice.id}`} className="btn btn-icon">
                  <Eye size={16} />
                </Link>
                <button className="btn btn-icon" onClick={() => handleDelete(invoice.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}