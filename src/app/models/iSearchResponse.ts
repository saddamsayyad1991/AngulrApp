import { IUser } from './iUser';

export interface ISearchResponse {
    Count: number;
    ScannedCount: number;
    lastEvaluatedKey: { id: string, name :string };
    Items: IUser[];
}
