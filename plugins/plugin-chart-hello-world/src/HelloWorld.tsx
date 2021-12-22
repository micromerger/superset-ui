/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { HelloWorldProps } from './types';
// import Map from "./plugin/chart/highMaps";
// import LeafletMap from "./plugin/react-chart/Map.js";
import LeafletChart from './plugin/leaflet-chart.js';
// import Map from "./plugin/components/Covid19.jsx"
// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

// const Styles = styled.div<HelloWorldStylesProps>`
//   background-color: ${({ theme }) => theme.colors.secondary.light2};
//   padding: ${({ theme }) => theme.gridUnit * 4}px;
//   border-radius: ${({ theme }) => theme.gridUnit * 2}px;
//   height: ${({ height }) => height};
//   width: ${({ width }) => width};
//   overflow-y: scroll;

//   h3 {
//     /* You can use your props to control CSS! */
//     font-size: ${({ theme, headerFontSize }) => theme.typography.sizes[headerFontSize]};
//     font-weight: ${({ theme, boldText }) => theme.typography.weights[boldText ? 'bold' : 'normal']};
//   }
// `;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function HelloWorld(props: HelloWorldProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const {
    circle,
    polygon,
    height,
    width,
    color,
    showPolygonLayer,
    showStreetMap,
    showCircleLayer,
    metricColorFormatters,
  } = props;

  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  // lets filter the data for map
  // for provincial level we will updata the data
  // let filteredData=new Array();
  // data.forEach((item)=>{
  //   if(Object.keys(item).includes(keyColumn)){
  //     if(Object.keys(item).includes(valueColumn)){
  //       filteredData.push({ `${keyColumn[0]}` : item[valueColumn] })
  //     }else if(Object.keys(item).includes(metricsColumn)){
  //       filteredData.push({item[keyColumn], item[metricsColumn]})
  //     }
  //   }
  // })
  console.log(metricColorFormatters);
  // console.log(metricColorFormatters[0].getColorFromValue(1231))
  // console.log(metricColorFormatters[1].getColorFromValue(123))

  return (
    <div>
      {/* <Map headerText={props.headerText} data={filteredData} mapLevel={mapLevel}/> */}
      <LeafletChart
        circle={circle}
        polygon={polygon}
        color={color}
        height={height}
        width={width}
        showPolygonLayer={showPolygonLayer}
        showStreetMap={showStreetMap}
        showCircleLayer={showCircleLayer}
        metricColorFormatters={metricColorFormatters}
      />
    </div>
  );
}
