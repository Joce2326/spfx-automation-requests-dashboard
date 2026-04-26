export interface IRequestCreate {
    title: string;
    department: string;
    requestType: string;
    priority: string;
    description: string;
    expectedBenefit: string;
    status?: string;
}