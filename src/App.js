import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css'; // Assuming your CSS file is named App.css

const api = {
  key: '6cb9c7967145c96e2197e8932e6c0445',
  base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [background, setBackground] = useState('');
  const [history, setHistory] = useState([]);

  const weatherBackgrounds = useMemo(() => ({
    Clear: 'sunny.jpeg',
    Clouds: 'cloudy.jpeg',
    Rain: 'rainy.jpeg',
  }), []);

  useEffect(() => {
    if (data.weather) {
      const weather = data.weather[0].main;
      const backgroundImage = weatherBackgrounds[weather] || 'default.jpg';
      setBackground(backgroundImage);
    }
  }, [data, weatherBackgrounds]);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const url = `${api.base}weather?q=${location}&appid=${api.key}`;
      axios.get(url)
        .then((response) => {
          setData(response.data);
          setError(null); // Clear previous errors

          // Add the search result to the history
          setHistory(prevHistory => [
            ...prevHistory,
            { location: response.data.name, temp: response.data.main.temp, description: response.data.weather[0].description }
          ]);

          console.log(response.data); // Log the entire response data
        })
        .catch((err) => {
          setError('Location not found');
          console.error(err);
        });
    }
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${background})` }}>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter your location"
          type="text"
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data.main && data.weather && data.weather.length > 0 && (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              <h1>{Math.round(data.main.temp - 273.15)}°C</h1>
            </div>
            <div className="description">
              <p>{data.weather[0].description}</p>
            </div>
          </div>
          <div className="bottom">
            <div className="feels">
              <p className="bold">{Math.round(data.main.feels_like - 273.15)}°C</p>
              <p>Feels like</p>
            </div>
            <div className="humidity">
              <p className="bold">{data.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className="bold">{data.wind.speed} m/s</p>
              <p>Wind Speed</p>
            </div>
          </div>
          <div className="history">
            <h2>Search History</h2>
            <ul>
              {history.map((item, index) => (
                <li key={index}>
                  {item.location}: {Math.round(item.temp - 273.15)}°C, {item.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
