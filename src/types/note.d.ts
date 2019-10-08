export interface INote {
  id: number;
  name: string;
  deadline: Date | undefined;
  isSync: boolean;
  isDone: boolean;
  remark: string;

  [propName: string]: any;
}
