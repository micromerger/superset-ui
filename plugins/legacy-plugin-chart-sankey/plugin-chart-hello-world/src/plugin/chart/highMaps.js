// @ts-ignore
// @ts-nocheck
import Highcharts from 'highcharts';
import React, { useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';
import Provincial from '../Pakistan JSON Shape files/Province.json';
import District from '../Pakistan JSON Shape files/District.json';
import Tehsil from '../Pakistan JSON Shape files/Tehsil.json';
import UC from '../Pakistan JSON Shape files/UC.json';

import { useEffect, useState } from 'react';

if (typeof window !== 'undefined') {
  window.proj4 = window.proj4 || proj4;
}

highchartsMap(Highcharts);

const HighMap = ({ data, headerText, mapLevel }) => {
  const [options, setOtions] = useState({
    chart: {
      map:
        mapLevel === 'province'
          ? Provincial
          : mapLevel === 'district'
          ? District
          : mapLevel === 'tehsil'
          ? Tehsil
          : UC,
    },
    title: {
      text: headerText,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom',
      },
    },
    colorAxis: {
      min: 0,
    },
    series: [
      {
        name: 'Countries',
        color: '#E0E0E0',
        enableMouseTracking: false,
      },
      {
        type: 'mapbubble',
        name: 'Population 2016',
        joinBy: ['hc-key', 'hc-key'],
        data: data,
        minSize: 4,
        maxSize: '12%',
        tooltip: {
          pointFormat: '{point.hc-key}: {point.z}, ',
        },
      },
    ],
    credits: {
      enabled: false,
    },
  });

  //useEffect to update the options on change in level
  useEffect(() => {
    console.log('Change in Map Level', mapLevel);

    setOtions({
      chart: {
        map:
          mapLevel === 'province'
            ? Provincial
            : mapLevel === 'district'
            ? District
            : mapLevel === 'tehsil'
            ? Tehsil
            : UC,
      },
      title: {
        text: headerText,
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom',
        },
      },
      colorAxis: {
        min: 0,
      },
      series: [
        {
          name: 'Countries',
          color: '#E0E0E0',
          enableMouseTracking: false,
        },
        {
          type: 'mapbubble',
          name: 'Population 2016',
          joinBy: ['hc-key', 'hc-key'],
          data: data,
          minSize: 4,
          maxSize: '12%',
          tooltip: {
            pointFormat: '{point.hc-key}: {point.z} thousands, ',
          },
        },
      ],
      credits: {
        enabled: false,
      },
    });
  }, [mapLevel]);

  //   this is the highchart that gets rendered on the screen
  return (
    <HighchartsReact
      options={options}
      highcharts={Highcharts}
      constructorType={'mapChart'}
      allowChartUpdate={true}
      immutable={false}
      updateArgs={[true, true, true]}
      oneToOne={true}
    />
  );
};
export default HighMap;
