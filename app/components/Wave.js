'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

function Wave() {
  const [totalForPreviousMonth, setTotalForPreviousMonth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://testingback.vercel.app/api/expensesForm/total-amount-for-previous-month');
        setTotalForPreviousMonth(response.data.totalForPreviousMonth);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Update series data with the fetched totalForPreviousMonth
  const seriesData = [
    {
      name: 'sale',
      data: [345, 27, 121, 676, 98, 321, 88, 986, 200, 5, 90],
    },
    {
      name: 'Expenses',
      data: [80, 355, 40, 97, 45, 156, 80, 321, 845, 109, 20, 80],
    },
  ];

  if (totalForPreviousMonth !== null) {
    // Update the 'Expenses' data for the previous month
    seriesData[1].data[seriesData[1].data.length - 1] = totalForPreviousMonth;
  }

  return (
    <React.Fragment>
      <div className="container-fluid rounded-md">
        <Chart
          type="area"
          width={750}
          height={300}
          series={seriesData}
          options={{
            title: {
              text: 'Financial',
              style: { fontSize: 20 },
            },
            stroke: { width: 1, curve: 'smooth' },
            xaxis: {
              title: { text: '', style: { fontSize: 20 } },
              categories: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
            },
            yaxis: {
              title: {
                // text:"No of commits",
                style: { fontSize: 20 },
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}

export default Wave;
