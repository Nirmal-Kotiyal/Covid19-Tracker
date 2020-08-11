import React,{useState,useEffect} from 'react';
import {FormControl,Select,MenuItem,CardContent,Card} from '@material-ui/core'
import Axios from 'axios';
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
import {sortData} from './Utils/Sort'
import LineGraph from './components/LineGraph'
import './App.css';
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from './Utils/ShowDataOnMap'

function App() {

const [countries, setcountries] = useState([]);
const [country, setcountry] = useState('worldwide')
const [countryInfo, setcountryInfo] = useState({});
const [tableData, setTableData] = useState([])
const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
const [mapZoom, setMapZoom] = useState(1.5)
const [mapCountries, setmapCountries] = useState([])
const [casesType, setCasesType] = useState("cases")



useEffect(() => {
  Axios.get('https://disease.sh/v3/covid-19/all').then(response=>setcountryInfo(response.data));
}, [])

useEffect(() => {
  const getCountriesData = async ()=>{
   const {data} = await Axios.get('https://disease.sh/v3/covid-19/countries');
   const countries = data.map((country)=>(
    {
    name:country.country,
    value:country.countryInfo.iso2
    } 
))
setmapCountries(data);
setTableData(sortData(data));
setcountries(countries);
  }
  getCountriesData();
}, [])


const onChangeDropdown = async(e)=>{
const countryCode = e.target.value;
setcountry(countryCode);

const url = countryCode==='worldwide'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`

const {data}=await Axios.get(url);

setcountryInfo(data);
if(e.target.value==='worldwide'){
  setMapCenter({ lat: 34.80746, lng: -40.4796});
}
else{
setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
}
setMapZoom(4);
}




  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app_dropdown">
      <Select variant="outlined" value={country} onChange={onChangeDropdown}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
      {countries.map(country=>(
      <MenuItem value={country.value}>{country.name}</MenuItem>
  ))}
      </Select>
      </FormControl>
      </div>
      <div className="app_stats">
        <InfoBox isBlue active={casesType === "cases"} onClick={(e) => setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
        <InfoBox active={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox isRed active={casesType === "deaths"} onClick={(e) => setCasesType("deaths")} title="Death" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      </div>

      {mapCountries?.length>0
      &&<Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
}
      </div>
      <Card className="app_right">
        <CardContent>

          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3 style={{margin:'20px 0px'}}>Worldwide new {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;