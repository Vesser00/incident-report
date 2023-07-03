import reports from "./data/reports.json"
import IncidentPin from "./img/alarm.png"
import EnginePin from "./img/Engine.png"
import FireStationPin from "./img/fire-station.png"
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react';

function App() {
    const mapContainerRef = useRef(null);

    const [weatherData, setWeatherData] = useState({
        stationID: "",
        temp: 0,
        windSpeed: 0,
        windDirection: 0
    })
    const [weatherStation, setWeatherStation] = useState("")

    useEffect(() => {
        const getWeatherData = async () => {
            let station = ""
            const options = {
                method: 'GET',
                url: 'https://meteostat.p.rapidapi.com/stations/nearby',
                params: {
                    lat: reports.address.latitude,
                    lon: reports.address.longitude
                },
                headers: {
                    'X-RapidAPI-Key': 'YOUR_API_KEY', // RapidAPI Key
                    'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
                }
            };
    
            try {
                const response = await axios.request(options);
                station = response.data.data[0].id
                console.log("StationID: ", station)
            } catch (error) {
                console.error(error);
            }
            const startDate = reports.description.event_opened.slice(0, reports.description.event_opened.indexOf("T"))
            const endDate = reports.description.event_closed.slice(0, reports.description.event_closed.indexOf("T"))
            const dataOptions = {
                method: 'GET',
                url: 'https://meteostat.p.rapidapi.com/stations/hourly',
                params: {
                    station: station,
                    start: startDate,
                    end: endDate,
                    tz: 'Europe/Berlin'
                },
                headers: {
                    'X-RapidAPI-Key': 'YOUR_API_KEY', // RapidAPI Key
                    'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
                }
            };
    
            try {
                const response = await axios.request(dataOptions);
                for (const data of response.data.data) {
                    if (Date.parse(reports.description.event_opened) < Date.parse(data.time)) {
                        console.log(data)
                        const tempWeatherData = {
                            stationID: station,
                            temp: data.temp,
                            windDirection: data.wdir,
                            windSpeed: data.wspd
                        }
                        setWeatherData(tempWeatherData)
                        break
                    }
                }   
            } catch (error) {
                console.error(error);
            }
        }

        getWeatherData()
    }, []);

    return (
        <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
    );
}

export default App;
