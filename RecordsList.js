import React from 'react';

export default function RecordsList({ records = [], onDelete }) {
  return (
    <div style={{ maxWidth: 900, margin: '20px auto' }}>
      <h2 style={{ color: '#58a6ff' }}>Saved Records</h2>
      {!records.length && <div>No saved records</div>}
      {records.map(r => (
        <div key={r._id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{r.input}</strong> — <span style={{ color: '#58a6ff' }}>{r.resolved?.name}</span>
              <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(r.createdAt).toLocaleString()}</div>
              {r.notes && <div style={{ marginTop: 6 }}>Notes: {r.notes}</div>}
            </div>
            <button onClick={() => onDelete(r._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
