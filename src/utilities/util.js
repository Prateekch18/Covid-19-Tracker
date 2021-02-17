import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';

const casesTypeColors = {
  cases: {
    hex: '#CC1034',
    multiplier: 400
  },
  recovered: {
    hex: '#7dd71d',
    multiplier: 600
  },
  deaths: {
    hex: '#A9A9A9',
    multiplier: 1000
  }
};

export const sortData = data => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const prettyPrintStat = stat => (
  stat ? `+${numeral(stat).format('0.0a')}` : '+0'
);

export const prettyPrintTotal = total => (
  total ? `${numeral(total).format('0.0a')}` : '0'
);

export const showDataOnMap = (data, casesType='cases') => (
  data.map(country => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
      key={uuidv4()}
    >
      <Popup>
        <div className='info-container'>
          <div className='info-flag'
            style={{ backgroundImage: `url(${country.countryInfo.flag})`}}
          />
          <div className='info-name'>{country.country}</div>
          <div className='info-confirmed'>Cases: {numeral(country.cases).format('0,0')}</div>
          <div className='info-recovered'>Recovered: {numeral(country.recovered).format('0,0')}</div>
          <div className='info-deaths'>Deaths: {numeral(country.deaths).format('0,0')}</div>
        </div>
      </Popup>
    </Circle>
  ))
);