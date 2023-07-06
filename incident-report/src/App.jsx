import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/Card"
import reports from "./data/reports.json"
import MapComponent from "./components/MapComponent";
import InfoComponent from "./components/InfoComponent";

export default function MapTest() {
    const sortedReports = reports.sort((report1, report2) => {
        const d1 = new Date(report1.description.event_opened)
        const d2 = new Date(report2.description.event_opened)
        return d2 - d1
    })

    const [center, setCenter] = useState([sortedReports[0].address.longitude, sortedReports[0].address.latitude])
    const [report, setReport] = useState(sortedReports[0])

    const handleClick = (number) => {
        const incidentReport = sortedReports.filter(report => report.description.incident_number === number)
        setReport(incidentReport[0])
        const newCenter = [incidentReport[0].address.longitude, incidentReport[0].address.latitude]
        setCenter(newCenter)
    }

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="overflow-auto">
                    <div className="pt-2" style={{ height: '100vh' }}>
                        <h3>Incident Reports</h3>
                        {
                            sortedReports.map(report => {
                                const date = new Date(report.description.event_opened)
                                return <div className="pb-2" key={report.description.incident_number}>
                                    <Card onClick={() => { handleClick(report.description.incident_number) }}>
                                        <Card.Body>
                                            <Card.Title>{report.description.type}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{report.description.subtype}</Card.Subtitle>
                                            <Card.Text>
                                                <small className="text-muted">{date.toLocaleString()}</small>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            })
                        }
                    </div>
                </Col>
                <Col md={8}>
                    <div style={{ height: '100vh' }}>
                        <MapComponent center={center} reports={sortedReports} />
                    </div>
                </Col>
                <Col md={2} className="overflow-auto">
                    <div className="pt-2" style={{ height: '100vh' }}>
                        <InfoComponent report={report}/>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}