import reports from "./data/reports.json"
import IncidentPin from "./img/alarm.png"
import EnginePin from "./img/Engine.png"
import FireStationPin from "./img/fire-station.png"
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

function App() {
    const mapContainerRef = useRef(null);
    const apiKey = "YOUR_API_KEY"; // Google Maps API key

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

    useEffect(() => {
        const loader = new Loader({
            apiKey,
        });

        loader
            .importLibrary('maps')
            .then(() => {
                const map = new window.google.maps.Map(mapContainerRef.current, {
                    center: { lat: reports.address.latitude, lng: reports.address.longitude }, 
                    zoom: 15,
                    mapId: '812d84d323444bff'
                });

                const markers = addMarkers(map)
            });
    }, [weatherData]);

    function addMarkers(map) {

        const markers = []
        const incidentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            `<h1 id="firstHeading" class="firstHeading">${reports.description.subtype}</h1>` +
            '<div id="bodyContent">' +
            `<p><b>${reports.address.address_line1}, ${reports.address.city}, ${reports.address.state}</b><br />` +
            `${reports.description.comments} <br />` +
            `<br />` + 
            `Temp: ${weatherData.temp} <br />` +
            `Wind Direction: ${weatherData.windDirection} <br />` +
            `Wind Speed: ${weatherData.windSpeed} <br />` +

            '<p>Attribution: Flat Icon, <a href="https://www.flaticon.com/free-icons/alarm" title="alarm icons">Alarm icons created by Flat Icons - Flaticon</a>' +
            "(last visited July 01, 2023).</p>" +
            "</div>" +
            "</div>";
        const markerOptions = {
            map: map,
            position: { lat: reports.address.latitude, lng: reports.address.longitude },
            icon: IncidentPin
        }
        const incidentInfoWindow = new google.maps.InfoWindow({
            content: incidentString,
            ariaLabel: "Incident Label"
        })
        const incidentMarker = new google.maps.Marker(markerOptions)
        markers.push(incidentMarker)



        incidentMarker.addListener("click", () => {
            incidentInfoWindow.open({
                anchor: incidentMarker,
                map,
            })
        })

        for (const apparatus of reports.apparatus) {
            const dispatched = {
                map: map,
                position: { lat: apparatus.unit_status.dispatched.latitude, lng: apparatus.unit_status.dispatched.longitude },
                icon: FireStationPin
            }
            const arrived = {
                map: map,
                position: { lat: apparatus.unit_status.arrived.latitude, lng: apparatus.unit_status.arrived.longitude },
                icon: EnginePin
            }
            const enroute = {
                map: map,
                position: { lat: apparatus.unit_status.enroute.latitude, lng: apparatus.unit_status.enroute.longitude },
                icon: EnginePin
            }
            const available = {
                map: map,
                position: { lat: apparatus.unit_status.available.latitude, lng: apparatus.unit_status.available.longitude },
                icon: EnginePin
            }

            markers.push(new google.maps.Marker(dispatched))
            markers.push(new google.maps.Marker(arrived))
            markers.push(new google.maps.Marker(enroute))
            markers.push(new google.maps.Marker(available))
        }

        return markers
    }

    return (
        <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
    );
}

export default App;
