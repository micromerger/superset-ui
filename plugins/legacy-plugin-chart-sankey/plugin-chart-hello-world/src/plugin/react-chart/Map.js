import React from 'react';
import { MapContainer, Polygon, LayerGroup, TileLayer } from 'react-leaflet';
import { generateRandomColor } from './RandomColor';
import newData from './newData.json';
const MyMap = () => {
  const getColor = () => {
    return generateRandomColor();
  };

  const position = [30.3753, 69.3451];

  return (
    <MapContainer
      zoom={8}
      center={position}
      style={{ width: '100%', height: '80%' }}
    >
      {/* <ReactLeafletGoogleLayer
        apiKey="AIzaSyA46bFZ5S9ubKsvuWnNuemda0U4Nj_HcwE"
        type="hybrid"
      /> */}
      <LayerGroup>
        {newData.map(district => {
          let color = getColor();
          return (
            <Polygon
              // opacity={1}

              fillColor={color}
              key={district.dist_id}
              color={color}
              positions={district}
            />
          );
        })}
      </LayerGroup>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MyMap;
