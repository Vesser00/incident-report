import reports from "./data/reports.json"
import IncidentPin from "./img/alarm.png"
import EnginePin from "./img/Engine.png"
import FireStationPin from "./img/fire-station.png"
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { useGeographic } from "ol/proj"
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector'
import { Icon, Style } from 'ol/style'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Card from 'react-bootstrap/Card'

function App() {
    const [show, setShow] = useState(false)

    const handleShow = () => { setShow(true) }
    const handleClose = () => { setShow(false) }

    const mapContainerRef = useRef(null)

    const [weatherData, setWeatherData] = useState({
        stationID: "",
        temp: 0,
        windSpeed: 0,
        windDirection: 0
    })
    const [weatherStation, setWeatherStation] = useState("")

    // useEffect(() => {
    //     const getWeatherData = async () => {
    //         let station = ""
    //         const options = {
    //             method: 'GET',
    //             url: 'https://meteostat.p.rapidapi.com/stations/nearby',
    //             params: {
    //                 lat: reports.address.latitude,
    //                 lon: reports.address.longitude
    //             },
    //             headers: {
    //                 'X-RapidAPI-Key': 'YOUR_API_KEY', // RapidAPI Key
    //                 'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
    //             }
    //         };
    
    //         try {
    //             const response = await axios.request(options)
    //             station = response.data.data[0].id
    //             console.log("StationID: ", station)
    //         } catch (error) {
    //             console.error(error);
    //         }
    //         const startDate = reports.description.event_opened.slice(0, reports.description.event_opened.indexOf("T"))
    //         const endDate = reports.description.event_closed.slice(0, reports.description.event_closed.indexOf("T"))
    //         const dataOptions = {
    //             method: 'GET',
    //             url: 'https://meteostat.p.rapidapi.com/stations/hourly',
    //             params: {
    //                 station: station,
    //                 start: startDate,
    //                 end: endDate,
    //                 tz: 'Europe/Berlin'
    //             },
    //             headers: {
    //                 'X-RapidAPI-Key': 'YOUR_API_KEY', // RapidAPI Key
    //                 'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
    //             }
    //         }
    
    //         try {
    //             const response = await axios.request(dataOptions)
    //             for (const data of response.data.data) {
    //                 if (Date.parse(reports.description.event_opened) < Date.parse(data.time)) {
    //                     console.log(data)
    //                     const tempWeatherData = {
    //                         stationID: station,
    //                         temp: data.temp,
    //                         windDirection: data.wdir,
    //                         windSpeed: data.wspd
    //                     }
    //                     setWeatherData(tempWeatherData)
    //                     break
    //                 }
    //             }   
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }

    //     getWeatherData()
    // }, [])

    useEffect(() => {
        useGeographic()

        const map = new Map({
            target: mapContainerRef.current,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                // TODO: Fix the hard coding of the initial map center
                center: [reports[1].address.longitude, reports[1].address.latitude],
                zoom: 15
            })
        })

        // const marker = new Feature({
        //     type: 'icon',
        //     geometry: new Point([reports.address.longitude, reports.address.latitude])
        // })
        
        // const vectorLayer = new VectorLayer({
        //     source: new VectorSource({
        //         features: [marker],
        //     }),
        //     style: new Style({
        //         image: new Icon({
        //             anchor: [0.5, 1],
        //             src: IncidentPin
        //         })
        //     })
        // })
        // map.addLayer(vectorLayer)

    }, [])

    return (
        <>
        <Button variant="primary" onClick={handleShow}>
            Reports
        </Button>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Incident Reports</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {
                reports.map(report => {
                    return <Card key={report.description.incident_number}>
                        <Card.Body>
                            <Card.Title>{report.description.type}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{report.description.subtype}</Card.Subtitle>
                            <Card.Text>
                                {report.description.event_opened}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                })
                }
            </Offcanvas.Body>
        </Offcanvas>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
        </>
    )
}

export default App
