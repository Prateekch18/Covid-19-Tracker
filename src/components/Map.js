import React from 'react';
import './styles/Map.css';
import { showDataOnMap } from '../utilities/util';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';

function Map({ countries, casesType, center, zoom }){
    return (
    <div className='map'>
        <LeafletMap center={center} zoom={zoom}>
        <TileLayer 
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {showDataOnMap(countries, casesType)}
        </LeafletMap>
    </div>
  );
};

export default Map;