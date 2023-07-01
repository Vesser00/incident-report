import './App.css'
import { Loader } from '@googlemaps/js-api-loader';
import reports from "./data/reports.json"
import IncidentPin from "./img/alarm.png"
import EnginePin from "./img/Engine.png"
import ArrivedPin from "./img/Arrived.png"
import FireStationPin from "./img/fire-station.png"

const apiOptions = {
    apiKey: "AIzaSyBv_ADwQqSzPOGZXcpOefKs3CyPk5WL_uU"
}

const loader = new Loader(apiOptions)

loader.load().then(() => {
    console.log("Maps JS API loaded")
    const map = displayMap()
    const markers = addMarkers(map)
    // console.log(reports)
})

fetch('./data')

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
    const markerOptions = {
        map: map,
        position: { lat: reports.address.latitude, lng: reports.address.longitude },
        icon: IncidentPin
    }
    const incidentMarker = new google.maps.Marker(markerOptions)
    markers.push(incidentMarker)

    for (const apparatus of reports.apparatus) {
        console.log(apparatus.unit_status)
        const dispatched = {
            map: map,
            position: { lat: apparatus.unit_status.dispatched.latitude, lng: apparatus.unit_status.dispatched.longitude},
            icon: FireStationPin
        }
        const arrived = {
            map: map,
            position: { lat: apparatus.unit_status.arrived.latitude, lng: apparatus.unit_status.arrived.longitude},
            icon: EnginePin
        }
        const enroute = {
            map: map,
            position: { lat: apparatus.unit_status.enroute.latitude, lng: apparatus.unit_status.enroute.longitude},
            icon: EnginePin
        }
        const available = {
            map: map,
            position: { lat: apparatus.unit_status.available.latitude, lng: apparatus.unit_status.available.longitude},
            icon: EnginePin
        }

        markers.push(new google.maps.Marker(dispatched))
        markers.push(new google.maps.Marker(arrived))
        markers.push(new google.maps.Marker(enroute))
        markers.push(new google.maps.Marker(available))
    }

    return markers
}