import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IRequestItem } from '../models/IRequestItem';

export interface INewRequestPanelProps {
    isOpen: boolean;
    listName: string;
    context: WebPartContext;
    item?: IRequestItem | null;
    onDismiss: () => void;
    onSaved: () => void | Promise<void>;
}