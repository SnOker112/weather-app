import React, { useState, useEffect } from "react";

const API_KEY = "24f246d079655b17050f8b185f170612";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}&lang=ru`
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке данных о погоде");
      }

      const data = await response.json();
      setWeather({
        name: data.name,
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
      localStorage.setItem("city", cityName);
    } catch (error) {
      console.log("Ошибка при загрузке данных. Проверьте название города.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const savedCity = localStorage.getItem("city") || "Moscow";
    setCity(savedCity);
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (city) {
        fetchWeather(city);
      }
    }, 10 * 60 * 1000); // 10 минут
    return () => clearInterval(interval);
  }, [city]);




  const handleCityChange = (e) => {
    setCity(e.target.value);
  };


  return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Приложение Погоды</h1>
        <div>
          <input
              type="text"
              placeholder="Введите город"
              value={city}
              onChange={handleCityChange}
          />
          <button onClick={() => fetchWeather(city)}>Обновить</button>
        </div>
        {loading ? (
            <p>Загрузка...</p>
        ) : weather ? (
            <div style={{ marginTop: "20px" }}>
              <h2>{weather.name}</h2>
              <p>Температура: {weather.temp}C</p>
              <p>Описание: {weather.description}</p>
              <img src={weather.icon} alt="Иконка погоды" />
            </div>
        ) : (
            <p>Введите город для получения данных о погоде</p>
        )}
      </div>
  );
};

export default App;