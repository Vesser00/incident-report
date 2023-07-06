import { useEffect, useState } from "react"
import axios from 'axios'

export default function WeatherComponent({ report }) {

    const [weatherData, setWeatherData] = useState({
        temp: 0,
        windSpeed: 0,
        windDirection: 0
    })

    const [weatherAPI, setWeatherAPI] = useState({
        latitude: report.address.latitude,
        longitude: report.address.longitude,
        start_date: report.description.event_opened.slice(0, report.description.event_opened.indexOf("T")),
        end_date: report.description.event_closed.slice(0, report.description.event_closed.indexOf("T")),
    })

    const weatherURL = `https://archive-api.open-meteo.com/v1/archive?latitude=${weatherAPI.latitude}&longitude=${weatherAPI.longitude}&start_date=${weatherAPI.start_date}&end_date=${weatherAPI.end_date}&hourly=temperature_2m,windspeed_10m,winddirection_10m,windgusts_10m&temperature_unit=fahrenheit&windspeed_unit=mph`

    useEffect(() => {

        async function getWeather() {
            try {
                const response = await axios.get(weatherURL);
                const hourlyData = response.data.hourly
                const hourData = response.data.hourly.time
                for (let i = 0; i < hourData.length; i++) {
                    if (Date.parse(hourData[i]) > Date.parse(report.description.event_opened)) {
                        const tempData = {
                            temp: hourlyData.temperature_2m[i-1],
                            windSpeed: hourlyData.windspeed_10m[i-1],
                            windDirection: hourlyData.winddirection_10m[i-1]
                        }
                        setWeatherData(tempData)
                        break
                    }
                }
                
              
            } catch (error) {
                console.error(error);
            }
        }

        getWeather()

    }, [report])

    return (
        <div>
            <p><b>Weather: <br/></b> 
            Temp: {weatherData.temp}°F<br/>
            Wind Speed: {weatherData.windSpeed} mph<br />
            Wind Direction: {weatherData.windDirection}°</p>
        </div>
    )
}