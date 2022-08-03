import { StudentToImport } from '../interfaces/student-to-import';
import { isEmail, Max, Min } from 'class-validator';

export const isStudentToImport = (arg: any): arg is StudentToImport => {
  if (!isEmail(arg.email)) {
    return false;
  }
  if (!(Min(arg.courseCompletion) && Max(arg.courseCompletion))) {
    return false;
  }
  if (!(Min(arg.courseEngagment) && Max(arg.courseEngagment))) {
    return false;
  }
  if (!(Min(arg.projectDegree) && Max(arg.projectDegree))) {
    return false;
  }
  if (!(Min(arg.teamProjectDegree) && Max(arg.teamProjectDegree))) {
    return false;
  } else {
    try {
      if (!Array.isArray(JSON.parse(arg.bonusProjectUrls))) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return true;
};
