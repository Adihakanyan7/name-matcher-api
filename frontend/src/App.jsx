import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [names, setNames] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  const fillExampleText = () => {
    setText(
      'James went to the store.\nThen John followed James.\nMichael did not go.\nJames was tired.'
    );
  };

  const fillExampleNames = () => {
    setNames('James, John, Michael');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Name Matcher</h1>
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Left side: inputs */}
        <div style={{ flex: 1 }}>
          <label>Paste Text:</label>
          <button onClick={fillExampleText} style={{ marginLeft: '1rem' }}>Example Text</button><br />
          <textarea
            rows="10"
            cols="60"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here"
          /><br /><br />

          <label>Names (comma-separated):</label>
          <button onClick={fillExampleNames} style={{ marginLeft: '1rem' }}>Example Names</button><br />
          <input
            type="text"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            size="60"
            placeholder="e.g. James, John, Michael"
          /><br /><br />

          <button onClick={handleSubmit}>Match Names</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        {/* Right side: results */}
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
