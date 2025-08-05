import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/roles');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, keywords: [] })
      });
      
      if (!response.ok) throw new Error('Failed to create role');
      
      const createdRole = await response.json();
      setRoles([...roles, createdRole]);
      setNewRole('');
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const roleData = roles.find(r => r.id === selectedRole);
      if (!roleData) return;

      const response = await fetch(`http://localhost:3001/api/roles/${roleData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
        })
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      alert('Settings saved successfully!');
      // Refresh roles list
      const updatedResponse = await fetch('http://localhost:3001/api/roles');
      const updatedData = await updatedResponse.json();
      setRoles(updatedData);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="settings-container">
      <h2>Role Management</h2>
      <div className="role-section">
        <form onSubmit={handleAddRole}>
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Add new role"
          />
          <button type="submit">Add Role</button>
        </form>
        
        <div className="role-list">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-item ${selectedRole === role.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedRole(role.id);
                setKeywords(role.keywords?.join(', ') || '');
              }}
            >
              {role.role}
            </div>
          ))}
        </div>
      </div>

      <div className="keywords-section">
        <h3>Keywords for {selectedRole ? roles.find(r => r.id === selectedRole)?.role || 'Selected Role' : 'Select Role'}</h3>
        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter comma-separated keywords (e.g., JavaScript, React, Node.js)"
          disabled={!selectedRole}
          rows="4"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <button 
        className="save-btn"
        onClick={handleSaveSettings}
        disabled={!selectedRole}
      >
        Apply Settings
      </button>
    </div>
  );
};

export default SettingsPage;
