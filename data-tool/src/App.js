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
  
  
  const markers = [
    { position: [52.5128, 13.3892], popupContent: "Marker 1" },
  ];

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
      <div>

        {data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
      <MapComponent markers={markers} polylines={polylines} />
    </div>
  );
}
export default App;
