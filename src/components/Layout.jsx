// src/components/Layout.js
import { Link, useLocation } from 'react-router-dom';
import { FileText, Plus, Home, User } from 'lucide-react';


export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/create', icon: Plus, label: 'Create Invoice' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <FileText size={24} />
          <span>InvoiceApp</span>
        </div>
        <div className="nav-links">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
