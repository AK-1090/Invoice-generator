// src/pages/Profile.js
import { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { Save } from 'lucide-react';

export default function Profile() {
  const { state, dispatch } = useInvoice();
  const [formData, setFormData] = useState(state.userProfile);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_PROFILE', payload: formData });
    alert('Profile updated successfully!');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile">
      <div className="page-header">
        <h1>Company Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>Company Information</h3>
          <div className="form-row">
            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Tax ID"
              value={formData.taxId}
              onChange={(e) => handleChange('taxId', e.target.value)}
            />
          </div>
          <textarea
            placeholder="Company Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
          />
          <div className="form-row">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          <Save size={18} />
          Save Profile
        </button>
      </form>
    </div>
  );
}