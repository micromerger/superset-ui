import React, { useState, useEffect, useRef } from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import provinceData from './Pakistan JSON Shape files/Province.json';
const districtData = require('./Pakistan JSON Shape files/District.json');
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import PercentageIcon from './percentage';
import PieIcon from './pie';
// import districtData from 'file-loader!./Pakistan JSON Shape files/District.json';
// import tehsilData from './Pakistan JSON Shape files/Tehsil.json';
// import ucData from './Pakistan JSON Shape files/UC.json';
import {
  MapContainer,
  GeoJSON,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  Marker,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
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
const colors = ['#E38627', '#C13C37', '#6A2135', '#FF5733', '#FF3386'];

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
    format,
  } = props;
  const mapContainer = useRef(null);
  const geoJsonLayer = useRef(null);

  const provinceStyles = {
    // fillColor: color,
    color: 'black',
    weight: 1,
  };
  const [state, setState] = useState({
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
    key: 0,
  });
  // calculating the total value of that value props

  const polygonDrawData = () => {
    if (
      !polygon.data ||
      polygon.data.length == 0 ||
      !polygon.mapLevel ||
      !polygon.keyColumn ||
      !polygon.valueColumn
    ) {
      console.log('returning null, polygon');
      return [];
    }
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
        mainData.properties.color = undefined;
        mainData.properties.value = undefined;
        mainData.properties.ratio = undefined;
        mainData.properties.value = item[polygon.valueColumn];
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
        if (item[polygon.valueColumn]) data.push(mainData);
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
    if (
      !circle.data ||
      circle.data.length == 0 ||
      !circle.mapLevel ||
      !circle.keyColumn ||
      !circle.valueColumn
    ) {
      console.log('returning null, circle');
      return [];
    }
    let highestValueCircle = 0;
    let totalValueCircle = 0;
    const geoJason =
      circle.mapLevel == 'province'
        ? provinceData.features
        : districtData.features;

    // now we will check for multi column values on the basis of which I will calcultate the circle draw data
    if (circle.valueColumn.length === 1) {
      circle.data.forEach(element => {
        totalValueCircle = element[circle.valueColumn[0]] + totalValueCircle;
      });
      circle.data.forEach(element => {
        if (highestValueCircle < element[circle.valueColumn[0]])
          highestValueCircle = element[circle.valueColumn[0]];
      });
      // now we will compare the valueProperty from areaproperties to find out if the are match the querydata
      let data = [];
      circle.data.forEach(item => {
        const mainData = geoJason.find(
          area => area.properties.CODE == item[circle.keyColumn],
        );
        if (mainData) {
          mainData.properties.value = item[circle.valueColumn[0]];
          mainData.properties.percentage = Number(
            Math.floor((item[circle.valueColumn[0]] / totalValueCircle) * 100),
          );
          if (item[circle.valueColumn[0]]) data.push(mainData);
        }
      });
      return data;
    } else if (circle.valueColumn.length === 2) {
      // now I will be calculating the value fro piecharts
      let data = [];
      circle.data.forEach(item => {
        const mainData = geoJason.find(
          area => area.properties.CODE == item[circle.keyColumn],
        );
        if (mainData) {
          mainData.properties.pieData = circle.valueColumn.map(valColumn => ({
            value: item[valColumn],
            title: valColumn,
          }));
          data.push(mainData);
        }
      });
      return data;
    } else return [];
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
  // const icon = L.divIcon({
  //   className: 'custom-icon',
  //   html: ReactDOMServer.renderToString(<Icon perc={state.key} />),
  // });
  return (
    <div style={{ width: width, height: height }}>
      <MapContainer
        ref={mapContainer}
        zoom={4}
        maxZoom={8}
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
        {showPolygonLayer ? (
          <GeoJSON
            ref={geoJsonLayer}
            style={provinceStyles}
            onEachFeature={onEachArea}
            data={polygonDrawData()}
          />
        ) : null}
        {showCircleLayer === 'none' ? null : showCircleLayer == 'circle' ? (
          <MarkerClusterGroup>
            {circleDrawData().map((area, index) => {
              let { value } = area.properties;
              return (
                <Marker
                  position={getCentroid(area.geometry.coordinates[0])}
                  icon={L.divIcon({
                    className: 'custom-icon',
                    html: ReactDOMServer.renderToString(
                      <dev
                        style={{ position: 'absolute', top: -10, left: -10 }}
                      >
                        <h4>{format(value)}</h4>
                      </dev>,
                    ),
                  })}
                />
              );
            })}
          </MarkerClusterGroup>
        ) : (
          <MarkerClusterGroup>
            {circleDrawData().map((area, index) => {
              let { percentage, value, pieData } = area.properties;
              return (
                <Marker
                  position={getCentroid(area.geometry.coordinates[0])}
                  icon={L.divIcon({
                    className: 'custom-icon',
                    html: ReactDOMServer.renderToString(
                      circle.valueColumn.length === 1 ? (
                        <PercentageIcon perc={percentage} />
                      ) : (
                        <PieIcon data={pieData} />
                      ),
                    ),
                  })}
                />
              );
            })}
          </MarkerClusterGroup>
        )}
        {/* showring legend */}
        {circle?.valueColumn?.length > 1 && showCircleLayer !== 'circle' ? (
          <div
            style={{
              bottom: 20,
              right: 0,
              zIndex: 1000,
              width: 150,
              position: 'absolute',
              borderBottomColor: 'white',
              borderBottomWidth: 20,
            }}
          >
            {circle.valueColumn.map((valColumn, index) => (
              <div style={{ justifyContent: 'center', alignContent: 'center' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    marginBottom: '-2px',
                    backgroundColor: colors[index],
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />
                {`  ${valColumn}`}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              bottom: 0,
              right: 0,
              zIndex: 1000,
              width: 100,
              height: 20,
              position: 'absolute',
              backgroundColor: 'white',
              borderBottomWidth: 20,
            }}
          >
            EOC BI Charts
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
