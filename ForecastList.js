import React from 'react';

function groupByDate(list = []) {
  const map = {};
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!map[date]) map[date] = [];
    map[date].push(item);
  });
  return map;
}

export default function ForecastList({ forecast }) {
  if (!forecast?.list) return null;

  const grouped = groupByDate(forecast.list);
  const days = Object.keys(grouped).slice(0, 5);

  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
      {days.map(day => {
        const items = grouped[day];
        const midday = items.find(i => i.dt_txt.includes('12:00:00')) || items[Math.floor(items.length / 2)];
        const icon = midday.weather[0].icon;
        const desc = midday.weather[0].description;
        const temp = Math.round(midday.main.temp);
        return (
          <div key={day} className="forecast-card">
            <div style={{ fontWeight: '600', color: '#58a6ff' }}>{day}</div>
            <img alt="forecast" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} style={{ width: 60 }} />
            <div style={{ fontSize: 20 }}>{temp}°C</div>
            <div style={{ fontSize: 12, textTransform: 'capitalize' }}>{desc}</div>
          </div>
        );
      })}
    </div>
  );
}
