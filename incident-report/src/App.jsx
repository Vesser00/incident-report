import './App.css'
import { Loader } from '@googlemaps/js-api-loader';
import reports from "./data/reports.json"
import IncidentPin from "./img/alarm.png"
import EnginePin from "./img/Engine.png"
import FireStationPin from "./img/fire-station.png"
import MarkerClusterer from '@google/markerclustererplus'

const apiOptions = {
    apiKey: "AIzaSyBv_ADwQqSzPOGZXcpOefKs3CyPk5WL_uU"
}

const loader = new Loader(apiOptions)

loader.load().then(() => {
    console.log("Maps JS API loaded")
    const map = displayMap()
    const markers = addMarkers(map)
})



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
        `${reports.description.comments}` +
        "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
        "south west of the nearest large town, Alice Springs; 450&#160;km " +
        "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
        "features of the Uluru - Kata Tjuta National Park. Uluru is " +
        "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
        "Aboriginal people of the area. It has many springs, waterholes, " +
        "rock caves and ancient paintings. Uluru is listed as a World " +
        "Heritage Site.</p>" +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
        "(last visited June 22, 2009).</p>" +
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