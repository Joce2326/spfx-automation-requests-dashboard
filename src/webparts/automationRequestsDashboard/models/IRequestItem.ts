export interface IRequestItem {
    id: number;
    title: string;
    department?: string;
    requestType?: string;
    description?: string;
    expectedBenefit?: string;
    priority?: string;
    requestedByName?: string;
    status?: string;
}