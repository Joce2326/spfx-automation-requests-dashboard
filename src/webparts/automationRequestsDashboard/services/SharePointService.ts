import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI, spfi } from '@pnp/sp';
import { SPFx } from '@pnp/sp/behaviors/spfx';

import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import { IRequestItem } from '../models/IRequestItem';
import { IRequestCreate } from '../models/IRequestCreate';

export class SharePointService {
    private _sp: SPFI;

    constructor(context: WebPartContext) {
        this._sp = spfi().using(SPFx(context));
    }

    public async getRequests(listName: string): Promise<IRequestItem[]> {
        const items = await this._sp.web.lists
            .getByTitle(listName)
            .items
            .select(
                'Id',
                'Title',
                'Department',
                'RequestType',
                'Description',
                'ExpectedBenefit',
                'Priority',
                'RequestedBy/Title',
                'Status',
                //'Status',
            )
            .expand('RequestedBy')
            .orderBy('Created', false)();

        return items.map((item: any) => ({
            id: item.Id,
            title: item.Title,
            department: item.Department,
            requestType: item.RequestType,
            description: item.Description,
            expectedBenefit: item.ExpectedBenefit,
            priority: item.Priority,
            requestedById: item.RequestedBy?.Id,
            requestedByName: item.RequestedBy?.Title,
            status: item.Status,
        }));
    }

    public async createRequest(listName: string, request: IRequestCreate): Promise<void> {
        await this._sp.web.lists.getByTitle(listName).items.add({
            Title: request.title,
            Department: request.department,
            RequestType: request.requestType,
            Priority: request.priority,
            Description: request.description,
            ExpectedBenefit: request.expectedBenefit,
            Status: request.status || 'New',
        });
    }

    public async updateRequest(
        listName: string,
        itemId: number,
        request: IRequestCreate
    ): Promise<void> {
        await this._sp.web.lists.getByTitle(listName).items.getById(itemId).update({
            Title: request.title,
            Department: request.department,
            RequestType: request.requestType,
            Priority: request.priority,
            Description: request.description,
            ExpectedBenefit: request.expectedBenefit,
            Status: request.status || 'New',
        });
    }

    public async deleteRequest(listName: string, itemId: number): Promise<void> {
        await this._sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
    }
}