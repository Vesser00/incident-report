import React, { useState, useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { useGeographic } from "ol/proj"
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector'
import { Icon, Style } from 'ol/style'
import OSM from 'ol/source/OSM'
import HAZMAT from '../img/HAZMAT.png'
import EMS from '../img/EMS.png'

function MapComponent({ center, reports }) {
    useGeographic()
    const mapContainerRef = useRef(null)
    const [mapInstance, setMapInstance] = useState(null)

    useEffect(() => {

        const map = new Map({
            target: mapContainerRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: center,
                zoom: 17
            })
        })
        reports.forEach(report => {
            const icon = report.description.type === 'EMS-1STRESP' ? EMS : HAZMAT
            const marker = new VectorLayer({
                source: new VectorSource({
                    features: [
                        new Feature({
                            geometry: new Point([report.address.longitude, report.address.latitude])
                        })
                    ]
                }),
                style: new Style({
                    image: new Icon({
                        src: icon,
                        anchor: [0.5, 1]
                    })
                })
            })
            map.addLayer(marker)
        })

        setMapInstance(map)

        return () => {
            map.setTarget(null)
        }

    }, [center])

    useEffect(() => {
        if (mapInstance) {
            const view = mapInstance.getView()

            view.animate({
                center: center,
                duration: 2000
            })
        }
    }, [center, mapInstance])

    function setMarkers() {
        let markerArray = []

        reports.forEach(report => {
            const marker = new VectorLayer({
                source: new VectorSource({
                    features: [
                        new Feature({
                            geometry: new Point([report.address.longitude, report.address.latitude])
                        })
                    ]
                }),
                style: new Style({
                    image: new Icon({
                        src: `${report.description.type}.png`
                    })
                })
            })
            markerArray.push(marker)
        })

        return markerArray
    }

    return (
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
    )
}

export default MapComponent
