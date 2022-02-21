import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './chart.css';
import ReactDOMServer from 'react-dom/server';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import Icon from './icon';

const Chart = props => {
  const { styles } = props;
  const [state, setState] = useState({
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
    key: 0,
  });
  const [timer, setTimer] = useState('');

  useEffect(() => {
    setTimer(
      setInterval(
        () => setState({ ...state, key: Math.floor(Math.random() * 100) + 1 }),
        1000,
      ),
    );

    // return () => {
    //   clearInterval(set);
    // };
  }, []);

  const position = [state.lat, state.lng];
  const icon = L.divIcon({
    className: 'custom-icon',
    html: ReactDOMServer.renderToString(<Icon perc={state.key} />),
  });
  return (
    <div style={{ width: styles.width - 50, height: styles.height }}>
      <MapContainer
        center={position}
        zoom={state.zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon} />
      </MapContainer>
    </div>
  );
};

export default Chart;
