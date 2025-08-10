import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState('');

  function submit(e) {
    e.preventDefault();
    if (text.trim()) onSearch(text.trim());
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const q = `${pos.coords.latitude},${pos.coords.longitude}`;
        onSearch(q);
      },
      err => alert(err.message)
    );
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 20, textAlign: 'center' }}>
      <input
        placeholder="Enter city, zip, or lat,lon"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: 8, width: 300, marginBottom: 10 }}
      />
      <div style={{ marginTop: 10 }}>
        <button type="submit" className="glow-button">Search</button>
        
      </div>
    </form>
  );
}
