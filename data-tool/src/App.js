import './App.css';
import 'leaflet/dist/leaflet.css';
import MapComponent from './MapComponent';
import { useEffect, useState } from 'react';
import * as XLSX from "xlsx";

function App() {

  const [data, setData] = useState([]);
  const [allData,setAllData] = useState([])
  const [filter,setFilter] = useState([])
  const [filtering,setFiltering] = useState(false)


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
      setAllData(parsedData)
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

  useEffect(()=>{
    if (filtering){
      filterData(filter)
    }else{
      setData(allData)
    

    }
  },[filtering,filter]
  )
  useEffect(()=>{
    if (!filtering){
      setFilter([])
    }
  },[filtering])



  function filterData(fieldList){
    let newData =[]
    allData.forEach((row)=>{
        let accepted=true
        for (const field of fieldList){

          if (!row[field]){
            accepted=false
          }
        }
        if(accepted){

          newData.push(row)
        }

    })
    setData(newData)
  }

  const polylines = [
    { 
      coordinates: [
        [52.5092, 13.3801],
        [52.5117, 13.4020],
      ], 
      color: "blue",
    }
  ];

  const handleCheck = (field) => {
    setFilter((prevFilter) => {
      if (prevFilter.includes(field)) {
        // If the checkbox is being unchecked
        const newFilter = prevFilter.filter((item) => item !== field);
        // Check if any filters are left after removing the current one
        const isAnyFilterLeft = newFilter.length > 0;
        // Set filtering accordingly
        setFiltering(isAnyFilterLeft);
        return newFilter;
      } else {
        // If the checkbox is being checked
        const newFilter = [...prevFilter, field];
        // Always set filtering to true when adding a new filter
        setFiltering(true);
        return newFilter;
      }
    });
  };
  
  


  return (
    
    <div>
      {console.log(filter)}
      
      
      <input 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        onChange={handleFileUpload} 
      />
      <MapComponent markers={markers} polylines={polylines} />
      Bike <input type='checkbox' checked={filter.includes("InvolvingBike")} onChange={() => handleCheck("InvolvingBike")} />
      Car <input type='checkbox' checked={filter.includes("InvolvingCar")} onChange={() => handleCheck("InvolvingCar")} />
      Pedestrian <input type='checkbox' checked={filter.includes("InvolvingPedestrian")} onChange={() => handleCheck("InvolvingPedestrian")} />
      Motorcycle <input type='checkbox' checked={filter.includes("InvolvingMotorcycle")} onChange={() => handleCheck("InvolvingMotorcycle")} />
      HGV <input type='checkbox' checked={filter.includes("InvolvingHGV")} onChange={() => handleCheck("InvolvingHGV")} />
      Other <input type='checkbox' checked={filter.includes("InvolvingOther")} onChange={() => handleCheck("InvolvingOther")} />

      <button onClick={()=>setFiltering(false)}>Clear Filter</button>
    </div>
  );
}
export default App;
