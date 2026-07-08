import {FileTypeEnum} from "./file.type.enum";

export interface FileUploadModel {
  id?: number;
  url?: string;
  type?: FileTypeEnum;
}
