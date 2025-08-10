import React from 'react';

export default function WeatherCard({ data }) {
  if (!data) return null;
  const { resolved, current } = data;
  const icon = current.weather?.[0]?.icon;
  const description = current.weather?.[0]?.description;

  return (
    <div className="card" style={{ width: 520, margin: '0 auto' }}>
      <h3 style={{ color: '#58a6ff' }}>{resolved.name}</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon && <img alt="icon" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />}
        <div style={{ marginLeft: 12 }}>
          <div style={{ fontSize: 28 }}>{Math.round(current.main.temp)}°C</div>
          <div style={{ textTransform: 'capitalize' }}>{description}</div>
          <div>Humidity: {current.main.humidity}%</div>
          <div>Wind: {current.wind.speed} m/s</div>
        </div>
      </div>
    </div>
  );
}
