import React, { useState, useEffect, useRef } from 'react';
import provinceData from './Pakistan JSON Shape files/Province.json';
const districtData = require('./Pakistan JSON Shape files/District.json');
// import districtData from 'file-loader!./Pakistan JSON Shape files/District.json';
// import tehsilData from './Pakistan JSON Shape files/Tehsil.json';
// import ucData from './Pakistan JSON Shape files/UC.json';
import {
  MapContainer,
  GeoJSON,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

//formula to get the center
var getCentroid = function (arr) {
  var twoTimesSignedArea = 0;
  var cxTimes6SignedArea = 0;
  var cyTimes6SignedArea = 0;

  var length = arr.length;

  var x = function (i) {
    return arr[i % length][0];
  };
  var y = function (i) {
    return arr[i % length][1];
  };

  for (var i = 0; i < arr.length; i++) {
    var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
    twoTimesSignedArea += twoSA;
    cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
    cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
  }
  var sixSignedArea = 3 * twoTimesSignedArea;
  return [
    cyTimes6SignedArea / sixSignedArea,
    cxTimes6SignedArea / sixSignedArea,
  ];
};

const LeafletMap = props => {
  const {
    polygon,
    circle,
    color,
    width,
    height,
    showPolygonLayer,
    showStreetMap,
    showCircleLayer,
  } = props;
  const [geoData, setGeoData] = useState(
    polygon.mapLevel == 'province'
      ? provinceData.features
      : districtData.features,
  );
  const [circleData, setCircleData] = useState(
    circle.mapLevel == 'province'
      ? provinceData.features
      : districtData.features,
  );
  const geoJsonLayer = useRef(null);
  const provinceStyles = {
    fillColor: color,
    color: 'black',
    weight: 2,
  };
  let highestValuePolygon = 0;
  let highestValueCircle = 0;
  // calculating the total value of that value props
  polygon.data.forEach(element => {
    if (element[polygon.valueColumn] > highestValuePolygon)
      highestValuePolygon = element[polygon.valueColumn];
  });

  circle.data.forEach(element => {
    if (element[circle.valueColumn] > highestValueCircle)
      highestValueCircle = element[circle.valueColumn];
  });
  const onEachArea = (area, layer) => {
    switch (polygon.mapLevel) {
      case 'district':
        return polygon.data.map(item => {
          if (item[polygon.keyColumn] == area.properties.DISTRICT_C) {
            layer.bindTooltip(
              `${area.properties.DISTRICT_N} [ ${polygon.valueColumn} : ${
                item[polygon.valueColumn]
              } ]`,
            );
            layer.options.fillOpacity =
              item[polygon.valueColumn] / highestValuePolygon;
          }
        });
      case 'province':
        return polygon.data.map(item => {
          if (item[polygon.keyColumn] == area.properties.WHO_PROV_C) {
            layer.bindTooltip(
              `${area.properties.GOV_PROV_N} ( ${polygon.valueColumn} : ${
                item[polygon.valueColumn]
              } )`,
            );
            console.log(
              area.properties.GOV_PROV_N,
              polygon.valueColumn,
              item[polygon.valueColumn],
            );
            layer.options.fillOpacity =
              item[polygon.valueColumn] / highestValuePolygon;
          }
        });
      default:
        return polygon.data.map(item => {
          if (item[polygon.keyColumn] == area.properties.name) {
            layer.bindTooltip(
              `${area.properties.name} ( ${polygon.valueColumn} : ${
                item[polygon.valueColumn]
              } )`,
            );
            layer.options.fillOpacity =
              item[polygon.valueColumn] / highestValuePolygon;
          }
        });
    }
  };
  var getRadius = areaProperties => {
    let radius = 0;
    let title = '';
    let subTitle = '';
    // now we will compare the valueProperty from areaproperties to find out if the are match the querydata
    if (circle.mapLevel == 'district') {
      circle.data.map(item => {
        if (item[circle.keyColumn] == areaProperties.DISTRICT_C) {
          radius = (item[circle.valueColumn] / highestValueCircle) * 10;
          title = `${areaProperties.DISTRICT_N}`;
          subTitle = `${circle.valueColumn}  : ${item[circle.valueColumn]}`;
        }
      });
    } else if (circle.mapLevel == 'province') {
      circle.data.map(item => {
        if (item[circle.keyColumn] == areaProperties.WHO_PROV_C) {
          radius = (item[circle.valueColumn] / highestValueCircle) * 10;
          title = `${areaProperties.WHO_PROV_N}`;
          subTitle = `${circle.valueColumn}  : ${item[circle.valueColumn]}`;
        }
      });
    }
    return { radius, title, subTitle };
  };

  useEffect(() => {
    if (geoJsonLayer.current) {
      if (polygon.mapLevel == 'province') {
        geoJsonLayer.current.clearLayers().addData(provinceData.features);
        setGeoData(provinceData.features);
      } else if (polygon.mapLevel == 'district') {
        geoJsonLayer.current.clearLayers().addData(districtData.features);
        setGeoData(districtData.features);
      }
    }
  }, [polygon.mapLevel]);

  useEffect(() => {
    if (circle.mapLevel == 'province') {
      setCircleData(provinceData.features);
    } else if (circle.mapLevel == 'district')
      setCircleData(districtData.features);
  }, [circle.mapLevel]);

  return (
    <div style={{ width: width, height: height }}>
      <MapContainer
        zoom={4}
        center={[30.3753, 69.3451]}
        style={{ height: '100%', width: '100%' }}
      >
        {/* showing street map based on a checkbox */}
        {showStreetMap ? (
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : null}
        {/* showing polygon based on checkbox */}
        {showPolygonLayer ? (
          <GeoJSON
            ref={geoJsonLayer}
            style={provinceStyles}
            onEachFeature={onEachArea}
            data={geoData}
          />
        ) : null}
        {showCircleLayer
          ? /* showing boxex in the center based on checkbox  */
            circleData.map((area, index) => {
              let { radius, title, subTitle } = getRadius(area.properties);

              if (radius > 1)
                return (
                  <CircleMarker
                    center={getCentroid(area.geometry.coordinates[0])}
                    pathOptions={{ color: 'red' }}
                    radius={radius}
                  >
                    <Popup>
                      {title} <br /> {subTitle}
                    </Popup>
                  </CircleMarker>
                );
              else return null;
            })
          : null}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
