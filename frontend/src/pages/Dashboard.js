import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcriptions, setTranscriptions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [summary, setSummary] = useState('');
  const [bulletPoints, setBulletPoints] = useState([]);
  const [keyItems, setKeyItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [denoise, setDenoise] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('denoise', denoise.toString());

      const response = await axios.post('/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcription);
      setCurrentTranscriptionId(response.data.transcription_id);
      setFile(null);
      setTranslatedText('');
      setSummary('');
      setBulletPoints([]);
    } catch (err) {
      setError('Error transcribing audio: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!currentTranscriptionId) {
      setError('Please transcribe an audio file first');
      return;
    }

    setSummarizing(true);
    setError('');

    try {
      const response = await axios.post(
        `/transcriptions/${currentTranscriptionId}/summarize`,
        {}
      );

      setSummary(response.data.summary);
      setBulletPoints(response.data.bullet_points);
    } catch (err) {
      setError('Error summarizing: ' + (err.response?.data?.error || err.message));
    } finally {
      setSummarizing(false);
    }
  };

  const handleExtractItems = async () => {
    if (!currentTranscriptionId) {
      setError('Please transcribe an audio file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`/transcriptions/${currentTranscriptionId}/extract-items`, {});
      setKeyItems(response.data.key_items || []);
    } catch (err) {
      setError('Error extracting key items: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (index) => {
    // toggle status locally and persist
    const items = [...keyItems];
    const item = items[index];
    item.status = item.status === 'open' ? 'done' : 'open';
    setKeyItems(items);

    try {
      await axios.post(`/transcriptions/${currentTranscriptionId}/key-items`, { key_items: items });
    } catch (err) {
      setError('Error updating key items: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleTranslate = async () => {
    if (!transcription) {
      setError('Please transcribe an audio file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/translate', {
        text: transcription,
        target: targetLanguage,
      });

      setTranslatedText(response.data.translatedText);
    } catch (err) {
      setError('Error translating text: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!currentTranscriptionId) {
      setError('No transcription to export');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `/transcriptions/${currentTranscriptionId}/export?format=${format}`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `minutes_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Error exporting: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`/transcriptions/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.results);
      setShowSearch(true);
    } catch (err) {
      setError('Error searching: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTranscriptions = async () => {
    try {
      const response = await axios.get('/transcriptions');
      setTranscriptions(response.data.transcriptions);
      setShowHistory(!showHistory);
    } catch (err) {
      setError('Error fetching transcriptions');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>⏰ MinuteMinds</h1>
          <p>AI-Powered Meeting Minutes Generator</p>
        </div>
        <div className="header-right">
          <span className="user-info">👤 {user?.full_name || user?.name}</span>
          {user?.role === 'admin' && (
            <>
              <button onClick={() => navigate('/admin')} className="admin-btn">
                🛡️ Admin Dashboard
              </button>
              <button onClick={() => navigate('/analytics')} className="admin-btn">
                📊 Analytics
              </button>
            </>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="container">
        {error && <div className="error-box">{error}</div>}

        {/* Section 1: Upload */}
        <section className="section">
          <h2>📤 Step 1: Upload Audio File</h2>
          <div className="upload-box">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {file && <p className="file-name">✓ Selected: {file.name}</p>}
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={denoise}
                onChange={(e) => setDenoise(e.target.checked)}
              />
              Apply noise filtering
            </label>
            <button 
              onClick={handleTranscribe} 
              disabled={loading || !file} 
              className="primary-btn"
            >
              {loading ? '⏳ Transcribing...' : '🎙️ Transcribe Audio'}
            </button>
          </div>
        </section>

        {/* Section 2: Transcription */}
        {transcription && (
          <section className="section">
            <h2>📝 Step 2: Transcription</h2>
            <div className="text-box">
              <p>{transcription}</p>
              <div className="action-buttons">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(transcription);
                    alert('Transcription copied!');
                  }} 
                  className="secondary-btn"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Summarize */}
        {transcription && (
          <section className="section">
            <h2>✨ Step 3: Generate Summary (AI-Powered)</h2>
            <button 
              onClick={handleSummarize} 
              disabled={summarizing || loading}
              className="primary-btn"
            >
              {summarizing ? '⏳ Summarizing...' : '🤖 Generate Summary'}
            </button>

            {summary && (
              <div className="summary-box">
                <h3>Summary</h3>
                <p>{summary}</p>

                {bulletPoints.length > 0 && (
                  <div className="bullet-points">
                    <h4>Key Points:</h4>
                    <ul>
                      {bulletPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

          {transcription && (
            <section className="section">
              <h2>🗂️ Step 3b: Decisions & Action Items</h2>
              <p>Automatically extract likely decisions and action items from the transcript.</p>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button onClick={handleExtractItems} className="secondary-btn" disabled={loading}>
                  {loading ? '⏳ Extracting...' : '🔎 Extract Items'}
                </button>
              </div>

              {keyItems.length > 0 && (
                <div className="summary-box" style={{marginTop: '1rem'}}>
                  <h3>Decisions & Action Items</h3>
                  <ul>
                    {keyItems.map((ki, idx) => (
                      <li key={idx} style={{margin: '0.5rem 0'}}>
                        <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                          <input type="checkbox" checked={ki.status === 'done'} onChange={() => handleToggleItem(idx)} />
                          <span style={{fontWeight: '600'}}>{ki.assignee ? `${ki.assignee} — ` : ''}</span>
                          <span>{ki.text}</span>
                          <small style={{marginLeft: 'auto', color: '#666'}}>{ki.status}</small>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

        {/* Section 4: Translate */}
        {transcription && (
          <section className="section">
            <h2>🌐 Step 4: Translate (Optional)</h2>
            <div className="translate-box">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
              <button 
                onClick={handleTranslate} 
                disabled={loading}
                className="secondary-btn"
              >
                {loading ? '⏳ Translating...' : '🔄 Translate'}
              </button>
            </div>

            {translatedText && (
              <div className="translated-box">
                <h3>Translated Text ({targetLanguage})</h3>
                <p>{translatedText}</p>
              </div>
            )}
          </section>
        )}

        {/* Section 5: Export */}
        {transcription && (
          <section className="section">
            <h2>💾 Step 5: Export Meeting Minutes</h2>
            <div className="export-buttons">
              <button 
                onClick={() => handleExport('docx')}
                disabled={loading}
                className="export-btn docx-btn"
              >
                📄 Export as DOCX
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                disabled={loading}
                className="export-btn pdf-btn"
              >
                📕 Export as PDF
              </button>
            </div>
          </section>
        )}

        {/* Section 6: Search */}
        <section className="section">
          <h2>🔍 Search Transcriptions</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter keyword to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="secondary-btn"
            >
              {loading ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </div>

          {showSearch && searchResults.length > 0 && (
            <div className="search-results">
              <h3>Found {searchResults.length} result(s)</h3>
              {searchResults.map((result) => (
                <div key={result._id} className="search-result">
                  <p><strong>File:</strong> {result.filename}</p>
                  <p><strong>Date:</strong> {new Date(result.created_at).toLocaleDateString()}</p>
                  {result.matching_segments.length > 0 && (
                    <div className="matching-segments">
                      <p><strong>Matching segments:</strong></p>
                      {result.matching_segments.map((seg, idx) => (
                        <p key={idx} className="segment">
                          [{seg.start.toFixed(2)}s] {seg.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 7: History */}
        <section className="section">
          <h2>📚 Transcription History</h2>
          <button onClick={handleFetchTranscriptions} className="secondary-btn">
            {showHistory ? '▼ Hide History' : '▶ Show History'}
          </button>

          {showHistory && transcriptions.length > 0 && (
            <div className="history-box">
              {transcriptions.map((t) => (
                <div key={t._id} className="history-item">
                  <p><strong>📝 {t.filename}</strong></p>
                  <p className="date">📅 {new Date(t.created_at).toLocaleDateString()}</p>
                  {t.summary && <p className="summary-preview">✨ Summary: {t.summary.substring(0, 100)}...</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
