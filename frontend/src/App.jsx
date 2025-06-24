import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [names, setNames] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [inputMode, setInputMode] = useState('manual');
  const [url, setUrl] = useState('');
  const [openNames, setOpenNames] = useState([]);

  const handleSubmit = async () => {
    setErrorMessage(null);
    const nameList = names.split(',')
      .map(n => n.trim())
      .filter(Boolean);

    // Send either { text, names } or { url, names }
    const payload = inputMode === 'url'
      ? { url, names: nameList }
      : { text, names: nameList };

    try {
      const res = await fetch('name-matcher-api-production.up.railway.app/match-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setResult(data);
      setOpenNames([]);
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred while contacting the server.');
    }
  };

  const toggleName = (name) => {
    setOpenNames(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(reader.result);
    reader.readAsText(file);
  };

  const fillExampleNames = () => {
    setNames('James, John, Elizabeth, Mary, George, Thomas, Henry, Alice, Sherlock, Watson');
  };

  const fillExampleText = () => {
    setText(
      `James went to the store.\n` +
      `Then John followed James.\n` +
      `Michael did not go.\n` +
      `James was tired.`
    );
  };

  const fillExampleUrl = () => {
    setUrl('https://www.gutenberg.org/files/11/11-0.txt');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h1 style={{ textAlign: 'center' }}>Name Matcher</h1>

      <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 1rem' }}>
        Paste or type a block of text and a comma-separated list of names.
        You can also upload a file or enter a URL.
      </p>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <button
          onClick={handleSubmit}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Match Names
        </button>
      </div>

      {errorMessage && (
        <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
      )}

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <fieldset style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
            <legend><strong>Input Mode</strong></legend>

            <label>
              <input
                type="radio"
                checked={inputMode === 'manual'}
                onChange={() => setInputMode('manual')}
              /> Manual Input
            </label><br />

            <label>
              <input
                type="radio"
                checked={inputMode === 'file'}
                onChange={() => setInputMode('file')}
              /> Upload File
            </label><br />

            <label>
              <input
                type="radio"
                checked={inputMode === 'url'}
                onChange={() => setInputMode('url')}
              /> Enter URL
            </label><br /><br />

            {inputMode === 'manual' && (
              <>
                <textarea
                  rows="10"
                  cols="60"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste or type text here"
                  style={{ width: '100%', fontFamily: 'monospace' }}
                />
                <br />
                <button onClick={fillExampleText}>Example Text</button>
              </>
            )}

            {inputMode === 'file' && (
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
              />
            )}

            {inputMode === 'url' && (
              <>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/file.txt"
                  style={{ width: '100%' }}
                />
                <br /><br />
                <button onClick={fillExampleUrl}>Example URL</button>
              </>
            )}
          </fieldset>

          <br />

          <fieldset style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
            <legend><strong>Names List</strong></legend>
            <input
              type="text"
              value={names}
              onChange={e => setNames(e.target.value)}
              placeholder="e.g. James, John, Mary..."
              style={{ width: '100%' }}
            />
            <br /><br />
            <button onClick={fillExampleNames}>Example Names</button>
          </fieldset>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid #ddd', paddingLeft: '1.5rem' }}>
          <h2>Results</h2>
          {result ? (
            <ul style={{ paddingLeft: '1rem' }}>
              {Object.entries(result).map(([name, positions]) => (
                <li key={name} style={{ marginBottom: '1rem' }}>
                  <button
                    onClick={() => toggleName(name)}
                    style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer' }}
                  >
                    {openNames.includes(name) ? '▼' : '▶'} {name} ({positions.length} matches)
                  </button>
                  {openNames.includes(name) && (
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', borderLeft: '2px solid #eee' }}>
                      {positions.map((pos, idx) => (
                        <li key={idx} style={{ fontFamily: 'monospace' }}>
                          Line: {pos.lineOffset + 1}, Char: {pos.charOffset + 1}
                        </li>
                      ))}
                    </ul>
                  )}
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
