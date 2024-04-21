import './App.css';
import 'leaflet/dist/leaflet.css';
import MapComponent from './MapComponent';
import {useEffect, useRef, useState} from 'react';
import * as XLSX from "xlsx";
import bikeLanes from './bikeLanes';

function App() {

  const [data, setData] = useState([]);
  const [allData,setAllData] = useState([])
  const [filter,setFilter] = useState([])
  const [filtering,setFiltering] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
      setAllData(parsedData);
    };
    reader.readAsArrayBuffer(file);
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

    const polylines = ()=>{
    const plines = [];
    const lanes = bikeLanes();
    
    for (const lines of lanes) {
        for (const line of lines) {
            const coordinates = [];
            for (const coord of line) {
                const latLng = [coord[1], coord[0]];
                //console.log('Coordinate:', latLng); // Log each coordinate
                coordinates.push(latLng);
            }
            plines.push({
                coordinates: coordinates,
                color: "blue" // You can customize the color here
            });
        }
    }
    console.log(plines)
    return plines;
    


    };

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

  // Reference for the data count element
  const dataCountRef = useRef(null);

  // Reference for the map filters element
  const mapFiltersRef = useRef(null);

    // Reference for the upload file element
    const uploadRef = useRef(null);

  useEffect(() => {
    if (dataCountRef.current && mapFiltersRef.current) {
      const dataCountHeight = dataCountRef.current.offsetHeight;
      mapFiltersRef.current.style.top = `${10 + dataCountHeight}px`; // Adjust the top position based on the height of data count
    }
  }, [data.length]); // This effect should run every time the data count might change



  return (

    <div>
      {console.log(filter)}
      <div className="map-container">
      <MapComponent markers={markers} polylines={polylines()} />
        <div ref={dataCountRef} className="data-count">
          Number of Accidents: {data.length}
        </div>
        <div ref={uploadRef} className="upload">
            <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
          />
        </div>

        <div ref={mapFiltersRef} className="map-filters">
          <label className="filter-item">
          Bike <input type='checkbox' checked={filter.includes("InvolvingBike")} onChange={() => handleCheck("InvolvingBike")} />
          </label>
          <label className="filter-item">
          Car <input type='checkbox' checked={filter.includes("InvolvingCar")} onChange={() => handleCheck("InvolvingCar")} />
          </label>
            <label className="filter-item">
          Pedestrian <input type='checkbox' checked={filter.includes("InvolvingPedestrian")} onChange={() => handleCheck("InvolvingPedestrian")} />
            </label>
              <label className="filter-item">
          Motorcycle <input type='checkbox' checked={filter.includes("InvolvingMotorcycle")} onChange={() => handleCheck("InvolvingMotorcycle")} />
              </label>
                <label className="filter-item">
          HGV <input type='checkbox' checked={filter.includes("InvolvingHGV")} onChange={() => handleCheck("InvolvingHGV")} />
                </label>
                  <label className="filter-item">
          Other <input type='checkbox' checked={filter.includes("InvolvingOther")} onChange={() => handleCheck("InvolvingOther")} />
                  </label>
                    <label className="filter-item">
          <button className="filter-button" onClick={()=>setFiltering(false)}>Clear Filter</button>
                    </label>
        </div>
      </div>
    </div>
  );
}
export default App;
