import "./Upload.css";
import React from "react";
import FileUpload from "./FileUpload";
import ScanUpload from "./ScanUpload";

type SubmitType = "SCANS" | "EXCEL" | "CSV";

/**
 * The Upload component is used for uploading different types of file
 * the two more common types are png files and xlsx files (xlsx are selected is by default)
 *
 */
export default function Upload(props: {
  title: string;
  submitType: SubmitType;
  onValidScansSubmitted?: (scans: FormData) => void;
  onValidFilesSubmitted?: (scans: FormData) => void;
  canSubmit: boolean;
  onFileChange: (filesAllowedList: any[]) => void;
  allowedFiles?: string[];
  initialFileList?: any[];
}) {
  const [allowedSubmit, setAllowedSubmit] = React.useState(true);
  const [fileList, setFileList] = React.useState(
    props.initialFileList ? props.initialFileList : []
  );

  // set the default allowed file types
  let allowedFiles = ["csv", "xlsx", "xls"];
  if (props.allowedFiles) {
    allowedFiles = props.allowedFiles;
  }

  // set the default title of the upload component
  let title = "Drop your files below";
  if (props.title) {
    title = props.title;
  }

  const onFileChange = (files: any) => {
    // check if the files uploaded are allowed
    // depending on the file extensions specified in the allowedFiles variable
    const filesAllowedList: any = [];
    files.forEach((file: any) => {
      filesAllowedList.push(
        allowedFiles
          .map((fileExtension) => {
            return file.name.includes(fileExtension);
          })
          .some((item) => item === true)
      );
    });
    props.onFileChange(files);
    setAllowedSubmit(!filesAllowedList.some((item: any) => item === false));
  };

  return (
    <div className="upload-page ">
      <div className="upload-page__body ">
        <div className="upload-page__body__box">
          <h2 className="upload-page__body__box__header">{title}</h2>
          {props.submitType === "SCANS" ? (
            <ScanUpload
              onFileChange={(files: any) => onFileChange(files)}
              allFilesAreValid={allowedSubmit}
              fileList={fileList}
              setFileList={setFileList}
              onValidScansSubmitted={props.onValidScansSubmitted}
              canSubmit={props.canSubmit}
            />
          ) : (
            <FileUpload
              onFileChange={(files: any) => onFileChange(files)}
              allFilesAreValid={allowedSubmit}
              fileList={fileList}
              setFileList={setFileList}
              onValidFilesSubmitted={props.onValidFilesSubmitted}
            />
          )}
        </div>
      </div>
    </div>
  );
}
