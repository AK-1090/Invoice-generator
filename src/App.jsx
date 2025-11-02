// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import PreviewInvoice from './pages/PreviewInvoice';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import './styles/App.css';

function App() {
  return (
    <InvoiceProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateInvoice />} />
            <Route path="/preview/:id" element={<PreviewInvoice />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </InvoiceProvider>
  );
}

export default App;