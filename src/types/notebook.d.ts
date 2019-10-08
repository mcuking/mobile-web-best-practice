import { INote } from './note';

export interface INotebook {
  id?: number;
  name: string;
  themeColor: string;
  notes: INote[];

  [propName: string]: any;
}
