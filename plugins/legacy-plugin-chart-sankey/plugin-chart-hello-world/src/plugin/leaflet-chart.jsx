import React, { useState, useEffect, useRef } from 'react';
import provinceData from './Pakistan JSON Shape files/Province.json';
import districtData from './Pakistan JSON Shape files/District.json';
import tehsilData from './Pakistan JSON Shape files/Tehsil.json';
import ucData from './Pakistan JSON Shape files/UC.json';

import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({
  level,
  data,
  keyColumn,
  valueColumn,
  color,
  width,
  height,
}) => {
  const [geoData, setData] = useState(
    level == 'province' ? provinceData.features : districtData.features,
  );
  const geoJsonLayer = useRef(null);
  const provinceStyles = {
    fillColor: color,
    color: 'black',
    weight: 2,
  };
  let highestValue = 0;
  data.forEach(element => {
    if (element[valueColumn] > highestValue)
      highestValue = element[valueColumn];
  });
  const onEachArea = (area, layer) => {
    switch (level) {
      case 'district':
        return data.map(item => {
          if (item[keyColumn] == area.properties.DISTRICT_C) {
            console.log(
              'Bind Value:',
              `${area.properties.DISTRICT_N} ${keyColumn} ${item[valueColumn]}`,
            );
            layer.bindTooltip(
              `${area.properties.DISTRICT_N} [ ${valueColumn} : ${item[valueColumn]} ]`,
            );
            layer.options.fillOpacity = item[valueColumn] / highestValue + 0.2;
          }
        });
      case 'province':
        return data.map(item => {
          if (item[keyColumn] == area.properties.WHO_PROV_C) {
            console.log(
              'Bind Value:',
              `${area.properties.GOV_PROV_N} ${keyColumn} ${item[valueColumn]}`,
            );
            layer.bindTooltip(
              `${area.properties.GOV_PROV_N} ( ${valueColumn} : ${item[valueColumn]} )`,
            );
            layer.options.fillOpacity = item[valueColumn] / highestValue + 0.2;
          }
        });
      default:
        return data.map(item => {
          if (item[keyColumn] == area.properties.name) {
            console.log(
              'Bind Value:',
              `${area.properties.name} ${keyColumn} ${item[valueColumn]}`,
            );
            layer.bindTooltip(
              `${area.properties.name} ( ${valueColumn} : ${item[valueColumn]} )`,
            );
            layer.options.fillOpacity = (item[valueColumn] / highestValue) * 5;
          }
        });
    }
  };

  useEffect(() => {
    console.log(geoJsonLayer);
    if (geoJsonLayer.current) {
      if (level == 'province') {
        geoJsonLayer.current.clearLayers().addData(provinceData.features);
        setData(districtData.features);
      } else if (level == 'district') {
        geoJsonLayer.current.clearLayers().addData(districtData.features);
        setData(districtData.features);
      } else if (level == 'tehsil') {
        geoJsonLayer.current.clearLayers().addData(tehsilData.features);
        setData(tehsilData.features);
      } else if (level == 'uc') {
        geoJsonLayer.current.clearLayers().addData(ucData.features);
        setData(ucData.features);
      }
      // if (props.pathOptions) {
      //   geoJsonLayer.current.layer.setStyle(props.pathOptions);
      // } else if (props.style) {
      //   layer.setStyle(props.style);
      // }
    }
  }, [level, data, keyColumn, valueColumn]);
  return (
    <div style={{ width: width, height: height }}>
      <MapContainer
        zoom={4}
        center={[30.3753, 69.3451]}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          ref={geoJsonLayer}
          style={provinceStyles}
          onEachFeature={onEachArea}
          data={geoData}
        />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
