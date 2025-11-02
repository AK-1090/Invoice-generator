// src/pages/CreateInvoice.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Plus, Trash2, Save } from 'lucide-react';

export default function CreateInvoice() {
  const { state, dispatch } = useInvoice();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 0,
    discount: 0,
    notes: ''
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    const tax = (subtotal * formData.taxRate) / 100;
    const discountAmount = (subtotal * formData.discount) / 100;
    const total = subtotal + tax - discountAmount;

    return { subtotal, tax, discountAmount, total };
  };

  const generateInvoiceNumber = () => {
    const lastInvoice = state.invoices[state.invoices.length - 1];
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber) : 0;
    return String(lastNumber + 1).padStart(4, '0');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { subtotal, tax, discountAmount, total } = calculateTotals();
    
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      ...formData,
      subtotal,
      tax,
      discountAmount,
      total,
      status: 'pending'
    };

    dispatch({ type: 'ADD_INVOICE', payload: newInvoice });
    navigate(`/preview/${newInvoice.id}`);
  };

  const { subtotal, tax, discountAmount, total } = calculateTotals();

  return (
    <div className="create-invoice">
      <div className="page-header">
        <h1>Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-section">
          <h3>Client Information</h3>
          <div className="form-row">
            <input
              type="text"
              placeholder="Client Name"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Client Email"
              value={formData.clientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
            />
          </div>
          <textarea
            placeholder="Client Address"
            value={formData.clientAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
            rows={3}
          />
          <div className="form-row">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            <input
              type="date"
              placeholder="Due Date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                required
              />
              <span className="item-total">
                ${(item.quantity * item.price).toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="btn btn-danger btn-icon"
                disabled={formData.items.length === 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="btn btn-secondary">
            <Plus size={16} />
            Add Item
          </button>
        </div>

        <div className="form-section">
          <h3>Totals</h3>
          <div className="totals-row">
            <label>Subtotal:</label>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="totals-row">
            <label>
              Tax (%):
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                step="0.1"
                min="0"
                className="small-input"
              />
            </label>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="totals-row">
            <label>
              Discount (%):
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                step="0.1"
                min="0"
                className="small-input"
              />
            </label>
            <span>${discountAmount.toFixed(2)}</span>
          </div>
          <div className="totals-row total">
            <label>Total:</label>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="form-section">
          <h3>Notes</h3>
          <textarea
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          <Save size={18} />
          Create Invoice
        </button>
      </form>
    </div>
  );
}