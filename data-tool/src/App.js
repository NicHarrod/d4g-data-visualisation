import './App.css';
import 'leaflet/dist/leaflet.css';
import MapComponent from './MapComponent';
import { useState } from 'react';
import * as XLSX from "xlsx";

function App() {

  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };
  
  let markerPositions = [];

  // Iterate over the data array
  data.forEach((row) => {
    // Push an array containing latitude and longitude into the coordinates array
    markerPositions.push([row["LatitudeWGS84"], row["LongitudeWGS84"]]);
  });

  let markers = [];
  markerPositions.forEach((position, index) => {
    // Create a new marker object with position and popupContent
    const marker = {
      position: position,
      popupContent: `Marker ${index + 1}` // Assuming index starts from 0
    };
    // Add the new marker to the markers array
    markers.push(marker);
  });

  const polylines = [
    { 
      coordinates: [
        [52.5092, 13.3801],
        [52.5117, 13.4020],
      ], 
      color: "blue",
    }
  ];


  return (
    <div>
      <input 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        onChange={handleFileUpload} 
      />
      <MapComponent markers={markers} polylines={polylines} />
    </div>
  );
}
export default App;
