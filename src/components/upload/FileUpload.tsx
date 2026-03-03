import React from "react";
import "./FileUpload.css";
import { ImageConfig, ValidImageConfigOptions } from "./ImageConfig";
import uploadImg from "../../assets/upload/cloud-upload-regular-240.png";
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import Button, { ButtonState } from "../buttons/Button";
import { AlertMessageSeverity } from "../alert_message/AlertMessage";
import toastFactory, { MessageSeverity } from "../alert_message/ToastMessage";

export default function FileUpload(props: {
  fileList: File[];
  setFileList: (files: File[]) => void;
  onFileChange: (files: File[]) => void;
  allFilesAreValid: boolean;
  onValidFilesSubmitted?: (formData: FormData) => void;
  canSubmit: boolean;
}) {
  const { fileList, setFileList } = props;
  const [outcome, setOutcome] = React.useState<UploadOutcomeType>(
    UploadOutcomeState.IDLE,
  );

  // drag-and-drop handlers
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const onDragEnter = () => wrapperRef?.current?.classList.add("dragover");
  const onDragLeave = () => wrapperRef?.current?.classList.remove("dragover");
  const onDrop = () => wrapperRef?.current?.classList.remove("dragover");

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  const fileRemove = (file: File) => {
    const updatedList = fileList.filter((f) => f !== file);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!props.allFilesAreValid) {
      toastFactory(
        "One or more uploaded file(s) are not supported",
        MessageSeverity.WARNING,
      );
      setOutcome(UploadOutcomeState.ERROR);
      return;
    }

    const formData = new FormData();
    fileList.forEach((file, index) => {
      formData.append(`upload_file${index + 1}`, file);
    });

    if (props.onValidFilesSubmitted) {
      props.onValidFilesSubmitted(formData);
    }
  };

  const resetState = () => {
    setOutcome(UploadOutcomeState.IDLE);
  };

  const renderSubmitButton = (outcome: UploadOutcomeType) => {
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
          <Button inner="Submit" onClick={handleSubmit} bgColor="rgb(35,197,94)" />
        ) : (
          <Button inner="Submit" onClick={handleSubmit} />
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
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {fileList.length > 0 && (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item, index) => (
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
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex mt-5 justify-center">{renderSubmitButton(outcome)}</div>
    </form>
  );
}

const UploadOutcomeState = {
  ...ButtonState,
  ...AlertMessageSeverity,
} as const;

type UploadOutcomeType = "success" | "idle" | "warning" | "error";
