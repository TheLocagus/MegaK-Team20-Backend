export interface MulterDiskUploadedFiles {
  [fieldName: string]:
    | {
        filename: string;
        size: number;
        mimetype: string;
        originalname: string;
        fieldname: string;
        encoding: string;
      }[]
    | undefined;
}
