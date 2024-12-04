import React from "react";
import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions, Chart } from "chart.js";
import {
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { ProcessDataPoint } from "../state_machine/monitoringPageTypes";

Chart.register(LineElement, PointElement, LineController, LinearScale, TimeScale);

export default function LineChart(props: {
  data: ProcessDataPoint[];
  title: string;
}) {
  const [MAX_POINTS, setMAX_POINTS] = React.useState(100);

  const getAverageProcessDataPoint = (
    data: ProcessDataPoint[]
  ): ProcessDataPoint => {
    // The returned average data point is the sum value and timestamp of all the data points
    // in the windows passed and divide by the windows length

    const averageDataPoint = { Value: 0, Timestamp: 0 };
    data.forEach((datum) => {
      averageDataPoint.Value += datum.Value;
      averageDataPoint.Timestamp += datum.Timestamp;
    });
    return {
      Value: averageDataPoint.Value / data.length,
      Timestamp: averageDataPoint.Timestamp / data.length,
    };
  };

  const chartData: ChartData<"line"> = {
    labels: props.data.map((datum) => new Date(datum.Timestamp)).slice(-MAX_POINTS),
    datasets: [
      {
        label: props.title,
        data: props.data.map((datum) => datum.Value).slice(-MAX_POINTS),
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0, // This makes the line straight
        pointRadius: 2, // This controls the size of the data points
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    animation: false,
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Value",
          color: "rgb(154,153,145)",
        },
      },
      x: {
        type: "time",
        time: {
          unit: "second",
        },
        title: {
          display: true,
          text: "Index",
          color: "rgb(154,153,145)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
