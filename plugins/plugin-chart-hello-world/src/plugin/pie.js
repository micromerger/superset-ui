import * as React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const colors = ['#E38627', '#C13C37', '#6A2135', '#FF5733', '#FF3386'];

const chart = ({ data }) => {
  console.log(data);
  const pieData = data.map((item, index) => {
    item.color = colors[index];
    return item;
  });
  console.log(pieData);
  return (
    <div
      style={{
        width: 100,
        height: 100,
        top: '-15px',
        left: '-15px',
        position: 'absolute',
      }}
    >
      <PieChart
        style={{ width: 50, height: 50 }}
        data={data}
        // label={data => data.dataEntry.title}
        // labelPosition={65}
        // labelStyle={{
        //   fontSize: '8px',
        //   fontColor: 'FFFFFA',
        //   fontWeight: '600',
        // }}
      />
    </div>
  );
};
export default chart;
