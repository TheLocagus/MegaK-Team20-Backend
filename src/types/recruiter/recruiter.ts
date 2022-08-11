export interface RecruiterInterface {
  id: string;
  email: string;
  fullName: string;
  company: string;
  maxReservedStudents: number;
}

export enum RecruiterActionsOfStatusEnum {
  noInterested = 'no-interested',
  forInterview = 'for-interview',
  employed = 'employed',
}
