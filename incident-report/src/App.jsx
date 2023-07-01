import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Loader } from '@googlemaps/js-api-loader';

const apiOptions = {
    apiKey: "AIzaSyBv_ADwQqSzPOGZXcpOefKs3CyPk5WL_uU"
}

const loader = new Loader(apiOptions)

loader.load().then(() => {
    console.log("Maps JS API loaded")
    const map = displayMap()
})

function displayMap() {
    const mapOptions = {
        center: { lat: -33.860664, lng: 151.208138 },
        zoom: 14
    }

    const mapDiv = document.getElementById('map')

    return new google.maps.Map(mapDiv, mapOptions)
}

// function App() {
//     const [count, setCount] = useState(0)

//     return (
//         <div className="App">
//             <div>
//                 <a href="https://vitejs.dev" target="_blank">
//                     <img src="/vite.svg" className="logo" alt="Vite logo" />
//                 </a>
//                 <a href="https://reactjs.org" target="_blank">
//                     <img src={reactLogo} className="logo react" alt="React logo" />
//                 </a>
//             </div>
//             <h1>Nite + React</h1>
//             <div id="map"></div>
//             <div className="card">
//                 <button onClick={() => setCount((count) => count + 1)}>
//                     count is {count}
//                 </button>
//                 <p>
//                     Edit <code>src/App.jsx</code> and save to test HMR
//                 </p>
//             </div>
//             <p className="read-the-docs">
//                 Click on the Vite and React logos to learn more
//             </p>
//         </div>
//     )
// }

// export default App
