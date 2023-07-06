import Container from "react-bootstrap/esm/Container"
import WeatherComponent from "./WeatherComponent"

export default function InfoComponent({report}) {
    return(
        <Container>
            <div>
                <h3>Information</h3>
            </div>
            <div>
                <p><b>Address: <br/></b> 
                {report.address.address_line1}<br />{report.address.city}, {report.address.state}</p>
                
            </div>
            <div>
                <p><b>Description: <br/></b> 
                {report.description.type}<br />{report.description.subtype}<br /></p>
            </div>
            <div>
                <p><b>Comments: <br/></b> 
                {report.description.comments}</p>
            </div>
            <WeatherComponent report={report}/>
        </Container>
    )
}