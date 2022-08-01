export class CreateStudentDto {
    password: string;
    bio: string;
    canTakeApprenticeship: (() => string);
    courses: string;
    education: string;
    expectedContractType: (() => string);
    expectedSalary: string;
    expectedTypeWork: (() => string);
    firstName: string;
    githubUsername: string;
    lastName: string;
    monthsOfCommercialExp: (() => string);
    portfolioUrls: string;
    targetWorkCity: string;
    telephone: string;
    workExperience: string;
}
