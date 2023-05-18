import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const Maps = () => {
  const containerStyle = { width: '600px', height: '400px' };
  const position = { lat: 43.9, lng: -71.0 }
  const center = { lat: 43.9, lng: -71.0 };

  return (
      <LoadScript googleMapsApiKey="AIzaSyB4EMLKJKwneotkyQ_2aFG4p0_MC8WGLh0">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12} >
          <Marker position={position} />
        </GoogleMap>
      </LoadScript>
    )
}
export default Maps;