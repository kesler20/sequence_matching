import React from "react";
import "./FileUpload.css";
import { ImageConfig, ValidImageConfigOptions } from "./ImageConfig";
import uploadImg from "../../assets/upload/cloud-upload-regular-240.png";
import LoadingSpinner from "../animated_components/LoadingSpinner";
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import Button, { ButtonState } from "../buttons/Button";
import { AlertMessageSeverity } from "../alert_message/AlertMessage";
import useStateApiDataContext from "../../contexts/ApiDataContextProvider";
import { updateFile, uploadFile } from "../../apis/requests";
import DataFrameFile, { UserFile } from "../../apis/DataFrameFile";
import { getResourceFromCache } from "../../apis/customHooks";
import toastFactory, { MessageSeverity } from "../alert_message/ToastMessage";

export default function FileUpload(props: {
  fileList: any;
  setFileList: any;
  onFileChange: any;
  allFilesAreValid: boolean;
  onValidFilesSubmitted?: (formData: FormData) => void;
}) {
  const { fileList, setFileList } = props;
  const { username, setUserFiles } = useStateApiDataContext();
  const [outcome, setOutcome] = React.useState<UploadOutcomeType>(
    UploadOutcomeState.IDLE
  );

  // initialise reference HTML elements
  const wrapperRef = React.useRef<HTMLInputElement>(null);
  const onDragEnter = () => wrapperRef?.current?.classList.add("dragover");
  const onDragLeave = () => wrapperRef?.current?.classList.remove("dragover");
  const onDrop = () => wrapperRef?.current?.classList.remove("dragover");

  // add files
  const onFileDrop = (e: any) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  // remove files
  const fileRemove = (file: any) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  // submit files
  const handleSubmit = (e: any) => {
    // reset the alert message to default (do not display)
    // setAlertMessageType(false);
    e.preventDefault();
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append("uploaded_file", file);
      const filename = file.name;
      console.log(filename, file.size);
      console.log(Array.from(formData.entries()));
      // if the file is allowed
      if (props.allFilesAreValid) {
        setOutcome(UploadOutcomeState.LOADING);
        initiateFileUpload(formData, filename, username);
      } else {
        toastFactory(
          "One or more uploaded file(s) are not supported 😞",
          MessageSeverity.WARNING
        );
        setOutcome(UploadOutcomeState.WARNING);
      }
    });
  };

  const initiateFileUpload = async (
    formData: FormData,
    filename: string,
    username: string
  ) => {
    const response = await uploadFile(formData, username);

    if (response !== undefined) {
      const newFile = new DataFrameFile(response);
      setUserFiles((userFile: UserFile[]) => {
        return [...userFile, newFile.getUserFile()];
      });
      setOutcome(UploadOutcomeState.SUCCESS);
      if (props.onValidFilesSubmitted) {
        props.onValidFilesSubmitted(formData);
      }
    } else {
      toastFactory(`updating ${filename} contents...`, MessageSeverity.INFO);
      initiateFileUpdate(formData, username, filename);
    }
  };

  const initiateFileUpdate = async (
    formData: FormData,
    username: string,
    filename: string
  ) => {
    const response = await updateFile(formData, username);

    if (response !== undefined) {
      let files: UserFile[] = getResourceFromCache("userFiles");
      files = files.map((fileFromCache: UserFile) => {
        if (fileFromCache.filename === filename) {
          const newFileContent = new DataFrameFile(response).getUserFile().content;
          const newFileContentTable = new DataFrameFile(response).getUserFile()
            .content_table;
          fileFromCache.content = newFileContent;
          fileFromCache.content_table = newFileContentTable;
        }
        return fileFromCache;
      });

      setUserFiles(files);
      toastFactory("File uploaded successfully!", MessageSeverity.SUCCESS);
      setOutcome(UploadOutcomeState.SUCCESS);
    } else {
      toastFactory(`There was an error updating ${filename}`, MessageSeverity.ERROR);
      setOutcome(UploadOutcomeState.ERROR);
    }
  };

  const resetState = (e: any) => {
    setOutcome(UploadOutcomeState.IDLE);
  };

  const renderAlertMessage = (outcome: UploadOutcomeType) => {
    switch (outcome) {
      case "idle":
        return <Button inner="Submit" buttonType={outcome} onClick={handleSubmit} />;
      case "loading":
        return <Button buttonType={outcome} inner={<LoadingSpinner />} />;

      case "success":
        return (
          <Button
            buttonType={outcome}
            inner={<FaCheck color="white" className="w-26" onClick={resetState} />}
          />
        );

      case "warning":
        return <Button inner={"Submit"} onClick={handleSubmit} />;

      case "error":
        return (
          <Button
            buttonType={outcome}
            inner={<RxCross1 color="red" onClick={resetState} />}
          />
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
                onClick={() => fileRemove(item)}
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
