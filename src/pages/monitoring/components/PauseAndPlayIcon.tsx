import * as React from "react";
import { AiOutlinePauseCircle, AiOutlinePlayCircle } from "react-icons/ai";
import { BsCloudDownload } from "react-icons/bs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  ProcessDataChannel,
  ResolutionKey,
} from "../state_machine/monitoringPageTypes";

export default function PauseAndPlayAndDownloadIcon(props: {
  dataStreamPaused: boolean;
  setDataStreamPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setResolution: React.Dispatch<React.SetStateAction<ResolutionKey>>;
  channel: ProcessDataChannel;
}) {
  const downloadExcel = () => {
    const rawData = props.channel.data;
    const data = rawData.map((dataPoint) => {
      return { ...dataPoint, Timestamp: new Date(dataPoint.Timestamp) };
    });

    // Convert JSON data to worksheet
    const worksheet = XLSX.utils.json_to_sheet<{ Value: number; Timestamp: Date }>(
      data
    );

    // Create a new Workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write workbook to a binary string
    const wbout = XLSX.write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "binary",
    });

    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    // Save binary string as Blob
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Trigger file save
    saveAs(
      blob,
      `${props.channel.name}_${new Date().getDate()}_${
        new Date().getMonth() + 1
      }_${new Date().getFullYear()}.xlsx`
    );
  };

  const startRealTimeStream = () => {
    props.setResolution("seconds");
    props.setDataStreamPaused(false);
  };

  return (
    <div className="flex flex-col h-full items-start justify-between">
      <BsCloudDownload
        size={"26"}
        color="rgb(0,136,209)"
        className="cursor-pointer flex items-center justify-center"
        onClick={downloadExcel}
      />
      {props.dataStreamPaused ? (
        <AiOutlinePlayCircle
          color="rgb(0,136,209)"
          size={"32"}
          className={`cursor-pointer flex items-center justify-center`}
          onClick={startRealTimeStream}
        />
      ) : (
        <AiOutlinePauseCircle
          color="rgb(0,136,209)"
          size={"32"}
          className={`cursor-pointer flex items-center justify-center`}
          onClick={() => props.setDataStreamPaused(true)}
        />
      )}
    </div>
  );
}
