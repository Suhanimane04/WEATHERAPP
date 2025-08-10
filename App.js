import './App.css';
import React, { useState, useEffect } from 'react';
import { fetchWeather, createRecord, fetchRecords, deleteRecord } from './services/api';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastList from './components/ForecastList';
import RecordsList from './components/RecordsList';

function App() {
  const [query, setQuery] = useState('');
  const [weatherResp, setWeatherResp] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const res = await fetchRecords();
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSearch(q) {
    setQuery(q);
    try {
      
      const res = await fetchWeather(q);
      setWeatherResp(res.data);
    } catch {
      alert('Error fetching weather');
    }
  }

  async function handleSaveRecord() {
    if (!query || !weatherResp) return;
    try {
      await createRecord({ input: query, notes: 'Saved from UI' });
      await loadRecords();
      alert('Record saved');
    } catch {
      alert('Save failed');
    }
  }

  async function handleDeleteRecord(id) {
    await deleteRecord(id);
    await loadRecords();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Weather App</h1>

      <SearchBar onSearch={handleSearch} />

      {weatherResp && (
        <>
          <WeatherCard data={weatherResp} />

          {/* Save Record Button - Centered */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button className="save-btn" onClick={handleSaveRecord}>
              Save Record
            </button>
          </div>

          <ForecastList forecast={weatherResp.forecast} />
        </>
      )}

      <RecordsList records={records} onDelete={handleDeleteRecord} />
    </div>
  );
}

export default App;
