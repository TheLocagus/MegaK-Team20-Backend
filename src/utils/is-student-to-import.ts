import { StudentToImport } from '../interfaces/student-to-import';
import { isEmail, Max, Min } from 'class-validator';

export const isStudentToImport = (arg: any): arg is StudentToImport => {
  if (
    !(arg && arg.email && typeof (arg.email === 'string') && isEmail(arg.email))
  ) {
    return false;
  }
  if (
    !(
      arg &&
      arg.courseCompletion &&
      typeof (arg.courseCompletion === 'number') &&
      Min(arg.courseCompletion) &&
      Max(arg.courseCompletion)
    )
  ) {
    return false;
  }
  if (
    !(
      arg &&
      arg.courseEngagment &&
      typeof (arg.courseEngagment === 'number') &&
      Min(arg.courseCompletion) &&
      Max(arg.courseCompletion)
    )
  ) {
    return false;
  }
  if (
    !(
      arg &&
      arg.projectDegree &&
      typeof (arg.projectDegree === 'number') &&
      Min(arg.courseCompletion) &&
      Max(arg.courseCompletion)
    )
  ) {
    return false;
  }
  if (
    !(
      arg &&
      arg.teamProjectDegree &&
      typeof (arg.teamProjectDegree === 'number') &&
      Min(arg.courseCompletion) &&
      Max(arg.courseCompletion)
    )
  ) {
    return false;
  }
  if (
    !(arg && arg.bonusProjectUrls && typeof (arg.bonusProjectUrls === 'string'))
  ) {
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
