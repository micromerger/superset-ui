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
  let {
    polygon,
    circle,
    color,
    width,
    height,
    showPolygonLayer,
    showStreetMap,
    showCircleLayer,
    metricColorFormatters,
  } = props;
  const mapContainer = useRef(null);
  const geoJsonLayer = useRef(null);

  const provinceStyles = {
    // fillColor: color,
    color: 'black',
    weight: 1,
  };
  const [state, setState] = useState(0);
  // calculating the total value of that value props

  const polygonDrawData = () => {
    // we will collect the highest here
    let highestPolygonData = 0;
    polygon.data.forEach(item =>
      item[polygon.valueColumn] > highestPolygonData
        ? (highestPolygonData = item[polygon.valueColumn])
        : null,
    );
    const geoJason =
      polygon.mapLevel == 'province'
        ? provinceData.features
        : districtData.features;
    let data = [];
    polygon.data.map(item => {
      const mainData = geoJason.find(
        area => area.properties.CODE == item[polygon.keyColumn],
      );
      if (mainData) {
        console.log(mainData.properties.color, mainData.properties.value);
        mainData.properties.color = undefined;
        mainData.properties.value = undefined;
        mainData.properties.ratio = undefined;
        mainData.properties.value = item[polygon.valueColumn];
        data.push(mainData);
        if (metricColorFormatters && metricColorFormatters.length > 0) {
          mainData.properties.formatter = 'custom';
          metricColorFormatters.map(formatter => {
            mainData.properties.color = formatter.getColorFromValue(
              item[polygon.valueColumn],
            )
              ? formatter.getColorFromValue(item[polygon.valueColumn])
              : mainData.properties.color;
          });
        } else {
          mainData.properties.formatter = 'default';
          mainData.properties.color = color;
          mainData.properties.ratio = Number(
            item[polygon.valueColumn] / highestPolygonData,
          ).toPrecision(2);
        }
      }
    });
    return data;
  };

  const getRGBValues = str => {
    var vals = str.match(
      /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/,
    );
    return `rgb(${vals[1]} , ${vals[2]} , ${vals[3]} )`;
  };
  const onEachArea = (area, layer) => {
    layer.bindTooltip(
      `${area.properties.NAME} [ ${polygon.valueColumn} : ${
        area.properties.value || 'UNKNOWN'
      } ]`,
    );
    console.log(area.properties, state);
    if (area.properties.formatter === 'default') {
      layer.options.fillOpacity = area.properties.ratio;
      layer.options.fillColor = area.properties.color;
    } else {
      layer.options.fillColor = area.properties.color
        ? getRGBValues(area.properties.color)
        : 'rgba(255,255,255, 0)';
      layer.options.fillOpacity = 1;
    }
  };
  const circleDrawData = () => {
    let highestValueCircle = 0;
    const geoJason =
      circle.mapLevel == 'province'
        ? provinceData.features
        : districtData.features;
    circle.data.forEach(element => {
      if (element[circle.valueColumn] > highestValueCircle)
        highestValueCircle = element[circle.valueColumn];
    });
    // now we will compare the valueProperty from areaproperties to find out if the are match the querydata
    let data = [];
    circle.data.map(item => {
      const mainData = geoJason.find(
        area => area.properties.CODE == item[circle.keyColumn],
      );
      if (mainData) {
        mainData.properties.value = item[circle.valueColumn];
        mainData.properties.radius = Number(
          (item[circle.valueColumn] / highestValueCircle) * 10,
        );
        data.push(mainData);
      }
    });
    return data;
  };
  useEffect(() => {
    //i will add the fields directly into the data.
    if (geoJsonLayer.current) {
      geoJsonLayer.current.clearLayers().addData(polygonDrawData());
    }
  }, [polygon.mapLevel, polygon.data, polygon.valueColumn, polygon.keyColumn]);

  useEffect(() => {}, [
    circle.mapLevel,
    circle.data,
    circle.keyColumn,
    circle.valueColumn,
  ]);

  return (
    <div style={{ width: width, height: height }}>
      <MapContainer
        ref={mapContainer}
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
        {/* {
          <Polygon
            pathOptions={{ color: 'purple' }}
            positions={feature.geometry.coordinates}
          >
            <Tooltip sticky>sticky Tooltip for Polygon</Tooltip>
          </Polygon>
        } */}
        {/* <Polygon
          pathOptions={{ color: 'purple' }}
          positions={polygonData[0].geometry.coordinates}
        >
          <Tooltip sticky>sticky Tooltip for Polygon</Tooltip>
        </Polygon> */}
        {showPolygonLayer ? (
          <GeoJSON
            ref={geoJsonLayer}
            style={provinceStyles}
            onEachFeature={onEachArea}
            data={polygonDrawData()}
          />
        ) : null}
        {showCircleLayer
          ? /* showing boxex in the center based on checkbox  */
            circleDrawData().map((area, index) => {
              let { radius, value } = area.properties;
              let title = area.properties.NAME;
              let subTitle = `[ ${circle.valueColumn} : ${value} ]`;
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
