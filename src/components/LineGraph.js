import React, { useState, useEffect } from 'react';
import { options } from '../utilities/options';
import { Line } from 'react-chartjs-2';


function LineGraph ({ casesType = 'cases' }){
  const [data, setData] = useState({});

  const buildChartData = (data, casesType = 'cases') => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if(lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint
        }
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }

    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
      .then(response => response.json())
      .then(data => {
        const chartData = buildChartData(data, casesType);
        setData(chartData);
      })
    }
    fetchData();
  }, [casesType]);

  return (
    <div>
      {data && data.length > 0 && 
        <Line 
          options={options}
          data={{
            datasets: [{
             backgroundColor: 'rgba(20, 16, 52, 0.5)',
             borderColor: "lightblack",
             data: data
            }]
          }} 
        />
      }
    </div>
  );
};

export default LineGraph;