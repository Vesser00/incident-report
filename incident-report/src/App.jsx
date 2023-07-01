import './App.css'
import { Loader } from '@googlemaps/js-api-loader';
import reports from "./data/reports.json"

const apiOptions = {
    apiKey: "AIzaSyBv_ADwQqSzPOGZXcpOefKs3CyPk5WL_uU"
}

const loader = new Loader(apiOptions)

loader.load().then(() => {
    console.log("Maps JS API loaded")
    const map = displayMap()
    console.log(reports)
})

fetch('./data')

function displayMap() {
    const mapOptions = {
        center: { lat: reports.address.latitude, lng: reports.address.longitude },
        zoom: 15,
        mapId: 'incident-report-dark',
    }

    const mapDiv = document.getElementById('map')

    return new google.maps.Map(mapDiv, mapOptions)
}
