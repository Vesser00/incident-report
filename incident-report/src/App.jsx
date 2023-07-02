import './App.css'
import { Loader } from '@googlemaps/js-api-loader';
import reports from "./data/reports.json"
import IncidentPin from "./img/alarm.png"
import EnginePin from "./img/Engine.png"
import FireStationPin from "./img/fire-station.png"
import MarkerClusterer from '@google/markerclustererplus'
import axios from 'axios'
import { useState } from 'react'

const apiOptions = {
    apiKey: "AIzaSyBv_ADwQqSzPOGZXcpOefKs3CyPk5WL_uU"
}

const loader = new Loader(apiOptions)

loader.load().then(() => {
    console.log("Maps JS API loaded")
    const map = displayMap()
    const markers = addMarkers(map)
})

const getWeather = async () => {
    let weatherData
    let station = ""
    const stationOptions = {
        method: 'GET',
        url: 'https://meteostat.p.rapidapi.com/stations/nearby',
        params: {
            lat: reports.address.latitude,
            lon: reports.address.longitude
        },
        headers: {
            'X-RapidAPI-Key': '5796a0f86fmshdb9a4f7f16283b2p1652f3jsn0adf4358540f',
            'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
        }
    };

    const response = await axios.request(stationOptions);
    station = response.data.data[0].id

    const startDate = reports.description.event_opened.slice(0, reports.description.event_opened.indexOf("T"))
    const endDate = reports.description.event_closed.slice(0, reports.description.event_closed.indexOf("T"))
    const options = {
        method: 'GET',
        url: 'https://meteostat.p.rapidapi.com/stations/hourly',
        params: {
            station: station,
            start: startDate,
            end: endDate,
            tz: 'Europe/Berlin'
        },
        headers: {
            'X-RapidAPI-Key': '5796a0f86fmshdb9a4f7f16283b2p1652f3jsn0adf4358540f',
            'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        for (const data of response.data.data) {
            if (Date.parse(reports.description.event_opened) < Date.parse(data.time)) {
                weatherData = data
                return weatherData
            }
        }   
    } catch (error) {
        console.error(error);
    }
    // console.log(weatherData)
}

function displayMap() {
    const mapOptions = {
        center: { lat: reports.address.latitude, lng: reports.address.longitude },
        zoom: 15,
        mapId: 'night',
    }

    const mapDiv = document.getElementById('map')

    return new google.maps.Map(mapDiv, mapOptions)
}

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
        `Temp: ${1} <br />` + 
        `Wind Direction: ${1} <br />` + 
        `Wind Speed: ${1} <br />` +
        
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