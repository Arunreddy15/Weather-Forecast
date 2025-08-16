import './App.css'
import React, { useEffect, useState } from 'react';
import { Wind, Droplet, Thermometer,ThermometerSnowflake , MapPin,SearchIcon,Send,Sunset, Sunrise } from 'lucide-react';
import axios from 'axios';
function App() {
  const API_KEY = '8af44ca2365c49a58e8104630250908'; // Replace with your real key
  
//   const conditionToEmoji = {
//   "Sunny": "☀️",
//   "Clear": "🌕",
//   "Partly Cloudy": "⛅",
//   "Cloudy": "☁️",
//   "Overcast": "🌥️",
//   "Mist": "🌫️",
//   "Fog": "🌁",
//   "Patchy rain nearby": "🌦️",
//   "Moderate rain": "🌧️",
//   "Heavy rain": "🌧️",
//   "Thunderstorm": "⛈️",
//   "Snow": "❄️",
//   "Blizzard": "🌨️",
//   "Freezing fog": "🧊",
//   "Hail": "🌨️",
//   "Dust": "🌪️",
//   "Sandstorm": "🌪️",
//   "Smoke": "💨"
// };
  const [current, setCurrent] = useState(null);
  const [location, setLocation] = useState('Hyderabad');
  const [information, setInformation] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch current weather
  const handleSubmit = async (e) => {
    console.log('handleSubmit called for location:', location);
      e.preventDefault();
      setLoading(true);
      try {
          const res = await axios.post('/api/greet', { location }); // proxy is used
          console.log('Response from backend:', res.data);
          console.log(typeof(res.data));
          setInformation(res.data);
          setLoading(false);
    } catch (err) {
      console.error(err);
      // if (err.response) {
      //   console.error(`Server responded with status ${err.response.status}: ${err.response.statusText}`);
      // } else 
      if (err.request) {
        console.error('Ops no response received. Is the backend running?');
      } else {
          console.error('Error: ' + err.message);
        }
      }
    };
  //eslint-disable-next-line react-hooks/exhaustive-deps
  // const getCurrentWeather = async () => {
  //   const res = await fetch(
  //     `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`// https://www.weatherapi.com/my/
  //   );
  //   return res.json();
  // };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentWeatherforecast = async () => {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=8`// https://www.weatherapi.com/my/
    );
    return res.json();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const getPlaceImage = async () => {
  //   const response = await fetch(
  //           `https://places.googleapis.com/v1/${location}/media`,
  //           {
  //             params: {
  //               key: API_KEYGA,
  //               maxHeightPx
  //             },
  //             responseType: 'blob', // Important for images
  //           }
  //         );

  //   const imageUrl = URL.createObjectURL(response.data);
  //   console.log('Image URL:', imageUrl);
  //   return imageUrl;
  // }
  const color='#fff'

  useEffect(() => {
    const fetchData = async () => {
      try {const data = await  await getCurrentWeatherforecast();
        setCurrent(data);
        
      } catch (error) {
        console.error('Error fetching current weather:', error);
      }
    };
    fetchData();
  }, [getCurrentWeatherforecast]);
  return (
    < div className='outer_container'>
      <div className="container_one">
        <div className="search-container">
          <SearchIcon className='search-icon' size={20} color='#0a252e'/> 
          <input
            className='citysearch'
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Send className='send-icon' size={20} color='#0a252e' onClick={handleSubmit} />
        </div>
        {/* </form> */}
        <h2 className='current-city'>Current 🌤️ in {current?.location?.name}</h2>
        <div className="datacontainer">
          <div className="data">
            <p className='localtime'>
              {current?.location?.localtime &&
              `${new Date(current.location.localtime).toLocaleDateString('en-US', { weekday: 'long' })}, ${new Date(current.location.localtime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
            <div className="tempcontainer">
              <img src={current?.current?.condition?.icon} alt="Weather Icon" />
              <h1>{current?.current?.temp_c}<span> °C</span></h1>
            </div>
            
            {/* <p>{conditionToEmoji[current?.current?.condition?.text]}</p> */}
          </div>
          <div className="data_lower">
            < div className="data_lower_sub">
            <h3><Wind size={20} color= {color} style={{ verticalAlign: 'middle' }}/> {current?.current?.wind_kph} kph</h3>
            <h3><Droplet size={20} color={color}  style={{ verticalAlign: 'middle' }}/> {current?.current?.humidity} %</h3>
            </div>
            < div className="data_lower_sub">
            <h3><ThermometerSnowflake color={color} size={20} style={{ verticalAlign: 'middle' }}/> {current?.current?.windchill_c} °C</h3>
            <h3><Thermometer color={color}  size={20} style={{ verticalAlign: 'middle' }}/> {current?.current?.heatindex_c} °C</h3>
            </div>
          </div>
            <h3><MapPin size={20} color={color} style={{ verticalAlign: 'middle' }}/> {current?.location?.lat} , {current?.location?.lon}</h3>
        </div>
        <h3 >{current?.location?.region}, {current?.location?.country}</h3>
      </div>
      <div className="container_two">
        <div className='forecast'>
          <ul className='forecast-list'>
            {current?.forecast?.forecastday?.map((day, index) =>
              index === 0 ? null : (
                <li key={index} className='forecast-item'>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  <img src={day.day.condition.icon} alt={day.day.condition.text} />
                  <span>{day.day.avgtemp_c}°C</span> 
                  <span className='sun-time'>🌞{day.astro.sunrise}</span>
                  <span className='sun-time'>🌅{day.astro.sunset}</span>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="wheather-desc">
          <h2 className='info-heading'>Information</h2>
          <section className='wheather-desc-text'>
            {loading ? <div className="loader"></div> : <p>{information}</p>}
          </section>
        </div>
      </div> 
    </div>
  )
}

export default App
