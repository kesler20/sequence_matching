import fileDefault from "../../assets/upload/file-blank-solid-240.png";
import fileCSS from "../../assets/upload/file-css-solid-240.png";
import filePdf from "../../assets/upload/file-pdf-solid-240.png";
import filePng from "../../assets/upload/file-png-solid-240.png";

export type ValidImageConfigOptions = "default" | "pdf" | "png" | "css";

export interface IImageConfig {
  default: string;
  pdf: string;
  png: string;
  css: string;
}
export const ImageConfig: IImageConfig = {
  default: fileDefault,
  pdf: filePdf,
  png: filePng,
  css: fileCSS,
};
