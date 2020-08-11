import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import Axios from "axios";

const options = {
legend: {
display: false,
},
elements: {
point: {
  radius: 0,
},
},
maintainAspectRatio: false,
tooltips: {
mode: "index",
intersect: false,
callbacks: {
  label: function (tooltipItem, data) {
    return numeral(tooltipItem.value).format("+0,0");
  },
},
},
scales: {
xAxes: [
  {
    type: "time",
    time: {
      format: "MM/DD/YY",
      tooltipFormat: "ll",
    },
  },
],
yAxes: [
  {
    gridLines: {
      display: false,
    },
    ticks: {
      // Include a dollar sign in the ticks
      callback: function (value, index, values) {
        return numeral(value).format("0a");
      },
    },
  },
],
},
};
  
const buildChartData = (data, casesType) => {
let chartData = [];
let lastDataPoint;
for (let date in data.cases) {
if (lastDataPoint) {
  let newDataPoint = {
    x: date,
    y: data[casesType][date] - lastDataPoint,
  };
  chartData.push(newDataPoint);
}
lastDataPoint = data[casesType][date];
}
return chartData;
};

function LineGraph({ casesType }) {
const [data, setData] = useState({});
const [currentColor, setcurrentColor] = useState({})
const Color ={
  cases:{
    backgroundColor:"#0000CD",
    borderColor:"#00008B"
  },
  recovered:{
    backgroundColor:"rgb(173,255,47)",
    borderColor:"rgb(144,238,144)"
  },
  deaths:{
    backgroundColor:"rgba(204, 16, 52, 0.5)",
    borderColor:"#CC1034"
  }
}

useEffect(() => {
const fetchData = async () => {
 const response =  await Axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
  
      let chartData = buildChartData(response.data, casesType);
      setData(chartData);
    
  setcurrentColor(Color[casesType]);
};

fetchData();

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [casesType]);

return (
<div>
  {data?.length > 0 && (
    <Line
      data={{
        datasets: [
          {
            backgroundColor: currentColor.backgroundColor,
            borderColor: currentColor.borderColor,
            data: data,
          },
        ],
      }}
      options={options}
    />
  )}
</div>
);
}

export default LineGraph;