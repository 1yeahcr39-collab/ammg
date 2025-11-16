import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const response = await axios.get('/admin/users');
        setUsers(response.data.users || []);
      } else if (activeTab === 'logs') {
        const response = await axios.get('/admin/logs');
        setLogs(response.data.logs || []);
      } else if (activeTab === 'analytics') {
        const response = await axios.get('/admin/analytics');
        setAnalytics(response.data);
      }
    } catch (err) {
      setError('Error fetching admin data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="header-left">
          <h1>🛡️ Admin Dashboard</h1>
          <p>System Management & Analytics</p>
        </div>
        <div className="header-right">
          <span className="user-info">👤 {user?.full_name || user?.name} (Admin)</span>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-container">
        <nav className="admin-nav">
          <button
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users Management
          </button>
          <button
            className={`nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📋 System Logs
          </button>
          <button
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </nav>

        <div className="admin-content">
          {error && <div className="error-box">{error}</div>}
          {loading && <div className="loading">Loading...</div>}

          {/* Users Tab */}
          {activeTab === 'users' && !loading && (
            <section className="admin-section">
              <h2>Users Management</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((u) => (
                        <tr key={u._id || u.id}>
                          <td>{u.name || u.full_name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td>
                            <button className="action-btn">Edit</button>
                            <button className="action-btn delete">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="info-text">Total Users: {users.length}</p>
            </section>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && !loading && (
            <section className="admin-section">
              <h2>System Logs</h2>
              <div className="logs-container">
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <div key={idx} className="log-entry">
                      <span className={`log-level ${log.level?.toLowerCase() || 'info'}`}>
                        [{log.level || 'INFO'}]
                      </span>
                      <span className="log-timestamp">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className="log-message">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#666' }}>No logs found</p>
                )}
              </div>
              <p className="info-text">Total Logs: {logs.length}</p>
            </section>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && !loading && (
            <section className="admin-section">
              <h2>System Analytics</h2>
              {analytics ? (
                <div className="analytics-grid">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{analytics.total_users || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Admins</h3>
                    <p className="stat-value">{analytics.total_admins || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Transcriptions</h3>
                    <p className="stat-value">{analytics.total_transcriptions || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Avg Processing Time</h3>
                    <p className="stat-value">
                      {analytics.avg_processing_time ? `${analytics.avg_processing_time.toFixed(2)}s` : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#666' }}>No analytics data available</p>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
