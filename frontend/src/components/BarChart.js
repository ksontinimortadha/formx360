import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ labels, values }) => {
  // Handle empty data case
  if (!labels.length || !values.length) return null;

  // This is the chart data structure
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Values",
        data: values, // Array of values for the dataset
        backgroundColor: "#007bff", // Here can be changed color of the bars
      },
    ],
  };

  return (
    <div className="barchart-container">
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
