// src/context/InvoiceContext.js
import { createContext, useContext, useReducer } from 'react';

// ... rest of the context remains the same

const InvoiceContext = createContext();

const initialState = {
  invoices: JSON.parse(localStorage.getItem('invoices')) || [],
  userProfile: JSON.parse(localStorage.getItem('userProfile')) || {
    companyName: '',
    email: '',
    phone: '',
    address: '',
    taxId: ''
  }
};

function invoiceReducer(state, action) {
  switch (action.type) {
    case 'ADD_INVOICE':
      const newInvoices = [...state.invoices, action.payload];
      localStorage.setItem('invoices', JSON.stringify(newInvoices));
      return { ...state, invoices: newInvoices };
    
    case 'UPDATE_INVOICE':
      const updatedInvoices = state.invoices.map(invoice =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      return { ...state, invoices: updatedInvoices };
    
    case 'DELETE_INVOICE':
      const filteredInvoices = state.invoices.filter(
        invoice => invoice.id !== action.payload
      );
      localStorage.setItem('invoices', JSON.stringify(filteredInvoices));
      return { ...state, invoices: filteredInvoices };
    
    case 'UPDATE_PROFILE':
      localStorage.setItem('userProfile', JSON.stringify(action.payload));
      return { ...state, userProfile: action.payload };
    
    default:
      return state;
  }
}

export function InvoiceProvider({ children }) {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  return (
    <InvoiceContext.Provider value={{ state, dispatch }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}