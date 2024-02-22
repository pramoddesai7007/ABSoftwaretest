"use client";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

function Dount() {
  return (
    <React.Fragment>
      <div className=" container-fluid rounded-md">
        {/* <h2>Dount</h2> */}
        <Chart
          type="donut"
          width={400}
          height={400}
          series={[25, 75]}
          options={{
            title: {
              text: "Transactions",
            },
            labels: ["Purchase", "Outward"],
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      fontSize: 30,
                      color: "black",
                    },
                  },
                },
              },
            },
            dataLabels: {
              enabled: true,
            },
            colors: ["#ff9900", "#3366cc"], // Customize these colors as needed
          }}
        />
      </div>
    </React.Fragment>
  );
}
export default Dount;
