import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import { sortData, prettyPrintStat, prettyPrintTotal } from './utilities/util';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import 'leaflet/dist/leaflet.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode  = event.target.value;
    
    const url = 
      countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
        .then(response => response.json())
        .then(data => {
          setCountry(countryCode);
          setCountryInfo(data);
          if(countryCode !== 'worldwide') {
            setMapCenter([data.countryInfo.lat, data.countryInfo.long])
            setMapZoom(4);
          }

          if(countryCode === 'worldwide') {
            setMapCenter({ lat: 34.80746, lng: -40.4796 })
            setMapZoom(3);
          }
        });
  };

  return (
    <div className='app'>
      <div className="app__left">

        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' value={country} onChange={onCountryChange} >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem key={uuidv4()} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div> 

        <div className="app__stats">
          <InfoBox 
            title='Coronavirus cases' 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintTotal(countryInfo.cases)} 
            onClick={e => setCasesType('cases')}
            active={casesType === 'cases'}
            isRed
          />
          <InfoBox 
            title='Recovered' 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintTotal(countryInfo.recovered)} 
            onClick={e => setCasesType('recovered')}
            active={casesType === 'recovered'}
          />
          <InfoBox 
            title='Deaths' 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintTotal(countryInfo.deaths)} 
            onClick={e => setCasesType('deaths')}
            active={casesType === 'deaths'}
            isRed
          />
        </div>

        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType} />
      </div>
      <div className="app__right">
      <Card >
        <CardContent>
          <div className="app__Info">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
              <br/>
              <br/>
              <div className="graph">
              <h3 className='app__graphTitle'>Wordwide new {casesType}</h3>
                <br/>
              <LineGraph casesType={casesType} />
              </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default App;