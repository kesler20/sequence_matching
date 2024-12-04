import React, { useEffect, useRef, useState } from "react";
import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js/auto";
import MQTTApi from "../../../../apis/mqtt/MQTTApi";
import {
  ProcessDataPoint,
  SensorFromBackend,
} from "../../state_machine/monitoringPageTypes";
import moment from "moment";

export default function AreaChart(props: {
  newData: ProcessDataPoint[];
  title: string;
  sensorFromBackend: SensorFromBackend;
}) {
  const [MAX_POINTS, setMAX_POINTS] = React.useState(25);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    Chart.register(...registerables);
    const chartCanvas = chartRef.current?.getContext("2d");

    if (!chartCanvas) {
      return;
    }

    const labels: string[] = props.newData.map((item) =>
      moment(item.Timestamp).format("HH:mm:ss.SSS")
    ); // Convert from epoch to JavaScript Date and format to 'HH:mm:ss.SSS'
    const values = props.newData.map((item) => item.Value);

    const data: ChartData<"line"> = {
      labels,
      datasets: [
        {
          label: props.title,
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          tension: 0, // This makes the line straight
          fill: true, // this makes it an area chart
          pointRadius: 2, // This controls the size of the data points
        },
      ],
    };

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "rgb(154,153,145)",
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
            // TODO: if theres is less data points it might be an issue.
            min: labels[labels.length - 1 - MAX_POINTS], // initial min value
            max: labels[labels.length - 1], // initial max value
            title: {
              display: true,
              text: "Time",
              color: "rgb(154,153,145)",
            },
          },
          y: {
            display: true,
            // max: 4, // props.newData.length > 0 ? undefined : 4
            title: {
              display: true,
              text: "Value",
              color: "rgb(154,153,145)",
            },
          },
        },
      },
    };

    myChartRef.current = new Chart(chartCanvas, config);
  }, []);

  useEffect(() => {
    const messageBus = new MQTTApi();
    messageBus.onConnect(() => {
      // subscribe to each sensorTopic to get real-time data
      const sensorTopic = props.sensorFromBackend.topic;

      messageBus.subscribeClient("testiot", () => {});

      messageBus.onMessage("testiot", (message: string) => {
        const msg = JSON.parse(message);
        if (sensorTopic === msg["OPC Point"]) {
          if (
            myChartRef.current &&
            myChartRef.current.data.labels &&
            myChartRef.current.data.datasets.length > 0
          ) {
            myChartRef.current.data.labels.push(
              moment(msg.Timestamp).format("HH:mm:ss.SSS")
            ); // Convert epoch timestamp to JavaScript Date and format to 'HH:mm:ss.SSS'
            myChartRef.current.data.datasets[0].data.push(msg.Value);
            if (myChartRef.current.data.labels.length > MAX_POINTS) {
              // Move the x-axis to the next time point
              if (
                myChartRef.current.options.scales &&
                myChartRef.current.options.scales.x
              ) {
                let xScale = myChartRef.current.options.scales.x;
                if (
                  typeof xScale.min === "string" &&
                  typeof xScale.max === "string"
                ) {
                  let labels = myChartRef.current.data.labels as string[];
                  let minIndex = labels.indexOf(xScale.min);
                  if (minIndex >= 0 && minIndex < labels.length - 1) {
                    xScale.min = labels[minIndex + 1];
                    if (minIndex + 1 + MAX_POINTS < labels.length) {
                      xScale.max = labels[minIndex + 1 + MAX_POINTS];
                    } else {
                      xScale.max = labels[labels.length - 1];
                    }
                  }
                }
              }
            }

            myChartRef.current.update();
          }
        }
      });
    });
    return () => {
      // unsubscribe when the component unmounts.
      messageBus.unsubscribeClient("testiot").disconnectClient();
    };
  }, [props.newData]);

  return <canvas ref={chartRef} className="w-full h-full" />;
}
