import { StudentToImport } from '../interfaces/student-to-import';
import { isEmail, max, min } from 'class-validator';

export const isStudentToImport = (arg: any): arg is StudentToImport => {
  if (!isEmail(arg.email)) {
    return false;
  }
  if (!(min(arg.courseCompletion, 1) && max(arg.courseCompletion, 5))) {
    return false;
  }
  if (!(min(arg.courseEngagment, 1) && max(arg.courseEngagment, 5))) {
    return false;
  }
  if (!(min(arg.projectDegree, 1) && max(arg.projectDegree, 5))) {
    return false;
  }
  if (!(min(arg.teamProjectDegree, 1) && max(arg.teamProjectDegree, 5))) {
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
