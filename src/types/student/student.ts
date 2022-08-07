export interface StudentInterface {
    id: string;
    status: string;
    pwdHash: string;
    currentTokenId: string | null;
    recruiterId: object;
    telephone: string;
    firstName: string;
    lastName: string;
    githubUsername: string;
    portfolioUrls: string;
    projectUrls: string;
    bio: string;
    expectedTypeWork: string;
    targetWorkCity: string;
    expectedContractType: string;
    canTakeApprenticeship: boolean;
    monthsOfCommercialExp: number;
    education: string;
    workExperience: string;
    courses: string;
    studentImport: object;

}

export interface GetOneStudentResponseInterface {
    bio: string;
    canTakeApprenticeship: boolean;
    courses: string;
    education: string;
    expectedContractType: string;
    expectedSalary: string;
    expectedTypeWork: string;
    firstName: string;
    githubUsername: string;
    lastName: string;
    monthsOfCommercialExp: number;
    portfolioUrls: string;
    targetWorkCity: string;
    telephone: string;
    workExperience: string;
    projectUrls: string;
    teamProjectDegree: number;
    projectDegree: number;
    courseEngagement: number;
    courseCompletion: number;

}
