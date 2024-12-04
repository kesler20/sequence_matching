import React from "react";
import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions, Chart, TimeUnit } from "chart.js";
import {
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import {
  ProcessDataSet,
} from "../../state_machine/monitoringPageTypes";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  TimeScale,
  annotationPlugin
);

export default function LineChartSoftSensor(props: {
  dataSet: ProcessDataSet;
  title: string;
  maxDataPoints: number;
  yMax?: number;
  yMin?: number;
  alertValue?: number;
}) {
  const backgroundColors = ["rgba(54, 162, 235, 0.3)", "red", "orange", "green"];
  const borderColors = ["rgba(54, 162, 235, 1)", "red", "orange", "green"];

  const addStylesToDataSet = (dataSet: ProcessDataSet) => {
    return dataSet.map((dataChannel, index) => {
      return {
        label: dataChannel.name,
        data: dataChannel.data
          .map((datum) => datum.Value)
          .slice(-props.maxDataPoints),
        borderWidth: 2,
        tension: 0, // This makes the line straight
        pointRadius: 2, // This controls the size of the data points
        backgroundColor: backgroundColors[index],
        borderColor: borderColors[index],
      };
    });
  };

  const getXAxis = () => {
    if (props.dataSet.length === 0) {
      return [];
    } else {
      return props.dataSet[0].data
        .map((datum) => datum.Timestamp)
        .slice(-props.maxDataPoints);
    }
  };

  const chartData: ChartData<"line"> = {
    labels: getXAxis(),
    datasets: addStylesToDataSet(props.dataSet),
  };

  const options: ChartOptions<"line"> = {
    animation: false,
    responsive: true,
    layout: {
      padding: {
        bottom: 20, // 10 for padding and 2*pointRadius for extra space
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "RNA Yield (g/L)",
          color: "rgb(154,153,145)",
        },
        max: props.yMax,
        min: props.yMin,
      },
      x: {
        ticks: {
          color: "rgb(174,173,165)",
        },
        title: {
          display: true,
          text: "Time (Minutes)",
          color: "rgb(154,153,145)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
