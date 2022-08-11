export interface AdminInterface {
  id: string;
  email: string;
}

export type AdminImportStudentsResponse =
  | {
      success: true;
      message: string;
      newImportedStudents: number;
      modifiedImportedStudents: number;
      errorImportedStudents: number;
    }
  | {
      success: false;
      message: string;
    };

export interface AdminImportRecruiterResponse {
  success: true | false;
  message: string;
}
