import React from "react";
import "./FileUpload.css";
import { ImageConfig, ValidImageConfigOptions } from "./ImageConfig";
import uploadImg from "../../assets/upload/cloud-upload-regular-240.png";
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import Button, { ButtonState } from "../buttons/Button";
import { AlertMessageSeverity } from "../alert_message/AlertMessage";
import toastFactory, { MessageSeverity } from "../alert_message/ToastMessage";

export default function ScanUpload(props: {
  fileList: any;
  setFileList: any;
  onFileChange: any;
  allFilesAreValid: boolean;
  onValidScansSubmitted?: (scanData: FormData) => void;
  canSubmit: boolean;
}) {
  const { fileList, setFileList } = props;
  const [outcome, setOutcome] = React.useState<UploadOutcomeType>(
    UploadOutcomeState.IDLE
  );

  // initialise reference HTML elements
  const wrapperRef = React.useRef<HTMLInputElement>(null);
  const onDragEnter = () => wrapperRef?.current?.classList.add("dragover");
  const onDragLeave = () => wrapperRef?.current?.classList.remove("dragover");
  const onDrop = () => wrapperRef?.current?.classList.remove("dragover");

  // add files
  const onScanDrop = (e: any) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  // remove files
  const scanRemove = (file: any) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  // send scans
  const handleSubmit = (e: any) => {
    // reset the alert message to default (do not display)
    // setAlertMessageType(false);
    e.preventDefault();
    const formData = new FormData();
    fileList.forEach((scan: any, index: number) => {
      formData.append(`upload_file${index + 1}`, scan);
    });
    // if the scan is allowed
    if (props.allFilesAreValid) {
      // pass the valid form data to the parent component
      if (props.onValidScansSubmitted) {
        props.onValidScansSubmitted(formData);
      }
    } else {
      toastFactory("Please Submit 2 scans", MessageSeverity.INFO);
      setOutcome(UploadOutcomeState.ERROR);
    }
  };

  const resetState = (e: any) => {
    setOutcome(UploadOutcomeState.IDLE);
  };

  const renderAlertMessage = (outcome: UploadOutcomeType) => {
    switch (outcome) {
      case "success":
        return (
          <Button
            buttonType={outcome}
            inner={<FaCheck color="white" className="w-26" onClick={resetState} />}
          />
        );
      case "error":
        return (
          <Button
            buttonType={outcome}
            inner={<RxCross1 color="red" onClick={resetState} />}
          />
        );
      default:
        return props.canSubmit ? (
          <Button inner={"Submit"} onClick={handleSubmit} bgColor="rgb(35,197,94)" />
        ) : (
          <Button inner={"Submit"} onClick={handleSubmit} />
        );
    }
  };

  return (
    <form>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="" />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onScanDrop} />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item: any, index: number) => (
            <div key={index} className="drop-file-preview__item">
              <img
                src={
                  ImageConfig[item.type.split("/")[1] as ValidImageConfigOptions] ||
                  ImageConfig["default"]
                }
                alt=""
              />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => scanRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex mt-5 justify-center">{renderAlertMessage(outcome)}</div>
    </form>
  );
}

const UploadOutcomeState = {
  ...ButtonState,
  ...AlertMessageSeverity,
} as const;

type UploadOutcomeType =
  | "success"
  | "idle"
  | "fetch success"
  | "fetch error"
  | "warning"
  | "loading"
  | "error";
