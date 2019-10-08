import { INote } from '@/types';
import { formatTime } from '@/utils/common-tools';

export default class Note {
  public id: number;
  public name: string;
  public deadline: Date | undefined;
  public isSync: boolean;
  public isDone: boolean;
  public remark: string;

  constructor(note: INote) {
    this.id = note.id;
    this.name = note.name;
    this.deadline = note.deadline;
    this.isSync = note.isSync;
    this.isDone = note.isDone;
    this.remark = note.remark;
  }

  public get isExpire() {
    if (this.deadline) {
      return this.deadline.getTime() < new Date().getTime();
    }
  }

  public get deadlineStr() {
    if (this.deadline) {
      return formatTime(this.deadline);
    }
  }
}
