import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import './Analytics.css';

function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || user.role !== 'admin') {
        setError('Admin access required');
        setLoading(false);
        return;
      }

      try {
        const resp = await axios.get('/admin/analytics');
        setMetrics(resp.data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) return <div className="analytics">Loading analytics...</div>;
  if (error) return <div className="analytics error">{error}</div>;

  // Prepare top users data
  const topUsers = (metrics.top_users || []).map((u) => ({ name: u._id, count: u.count }));

  // Prepare recent metrics grouped by day
  const recent = metrics.recent_metrics || [];
  const byDay = {};
  recent.forEach((m) => {
    const d = new Date(m.timestamp).toISOString().split('T')[0];
    byDay[d] = (byDay[d] || 0) + 1;
  });
  const recentData = Object.keys(byDay).sort().map((k) => ({ date: k, count: byDay[k] }));

  return (
    <div className="analytics container">
      <h2>Admin Analytics</h2>

      <div className="cards">
        <div className="card">
          <h3>Total Users</h3>
          <p className="big">{metrics.total_users}</p>
        </div>
        <div className="card">
          <h3>Total Transcriptions</h3>
          <p className="big">{metrics.total_transcriptions}</p>
        </div>
        <div className="card">
          <h3>Total Logins</h3>
          <p className="big">{metrics.total_logins}</p>
        </div>
      </div>

      <section className="chart-section">
        <h3>Top Users by Transcriptions</h3>
        {topUsers.length === 0 ? (
          <p>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topUsers} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="chart-section">
        <h3>Recent Metrics (events per day)</h3>
        {recentData.length === 0 ? (
          <p>No recent metrics</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={recentData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#ff6b6b" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}

export default Analytics;
