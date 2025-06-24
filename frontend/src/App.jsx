import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [names, setNames] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('manual'); // manual | file | url
  const [url, setUrl] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    const nameList = names.split(',').map(n => n.trim()).filter(Boolean);

    try {
      const res = await fetch('http://localhost:3000/match-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, names: nameList }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while contacting the backend.');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(reader.result);
    reader.readAsText(file);
  };

  const fetchFromUrl = async () => {
    try {
      const res = await fetch(url);
      const txt = await res.text();
      setText(txt);
    } catch (err) {
      console.error(err);
      setError('Failed to load text from URL');
    }
  };

  const fillExampleNames = () => {
    setNames('James, John, Elizabeth, Mary, George, Thomas, Henry, Alice, Sherlock, Watson');
  };

  const fillExampleText = () => {
    setText(`James went to the store.\nThen John followed James.\nMichael did not go.\nJames was tired.`);
  };

  const fillExampleUrl = () => {
    setUrl('http://localhost:5173/big.txt');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Name Matcher</h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <div>
            <label>Select input source:</label><br />
            <label><input type="radio" checked={inputMode === 'manual'} onChange={() => setInputMode('manual')} /> Manual input</label><br />
            <label><input type="radio" checked={inputMode === 'file'} onChange={() => setInputMode('file')} /> Upload file</label><br />
            <label><input type="radio" checked={inputMode === 'url'} onChange={() => setInputMode('url')} /> Load from URL</label><br /><br />

            {inputMode === 'manual' && (
              <div>
                <textarea
                  rows="10"
                  cols="60"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here"
                />
                <br />
                <button onClick={fillExampleText}>Example Text</button>
              </div>
            )}

            {inputMode === 'file' && (
              <input type="file" accept=".txt" onChange={handleFileChange} />
            )}

            {inputMode === 'url' && (
              <div>
                <input
                  type="url"
                  value={url || ''}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/file.txt"
                  size="60"
                />
                <button onClick={fetchFromUrl} style={{ marginLeft: '0.5rem' }}>Load Text</button>
                <button onClick={fillExampleUrl} style={{ marginLeft: '0.5rem' }}>Example URL</button>
              </div>
            )}
          </div>

          <br />

          <label>Names (comma-separated):</label>
          <button onClick={fillExampleNames} style={{ marginLeft: '1rem' }}>Example Names</button><br />
          <input
            type="text"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            size="60"
            placeholder="e.g. James, John, Mary..."
          /><br /><br />

          <button onClick={handleSubmit}>Match Names</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        <div style={{ flex: 1 }}>
          <h2>Results:</h2>
          {result ? (
            <ul>
              {Object.entries(result).map(([name, positions]) => (
                <li key={name} style={{ marginBottom: '1rem' }}>
                  <strong>{name}</strong> - {positions.length} matches
                  <ul>
                    {positions.map((pos, idx) => (
                      <li key={idx}>Line: {pos.lineOffset}, Char: {pos.charOffset}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
