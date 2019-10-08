import createDB from '@/utils/create-indexDB';

import { INotebook } from '@/types';

export interface INotebookService {
  create(payload: INotebook): Promise<number>;
  edit(payload: INotebook): Promise<void>;
  get(id: number): Promise<INotebook | undefined>;
  delete(id: number): Promise<void>;
  getList(query: ListQuery): Promise<{ data: INotebook[]; total: number }>;
}

export class NotebookService implements INotebookService {
  public async create(payload: INotebook): Promise<number> {
    const db = await createDB();

    const id = await db.add('notebooks', payload);
    return id;
  }

  public async edit(payload: INotebook): Promise<void> {
    const db = await createDB();

    await db.put('notebooks', payload);
  }

  public async get(id: number): Promise<INotebook | undefined> {
    const db = await createDB();

    const notebook = await db.getFromIndex('notebooks', 'id', id);
    return notebook;
  }

  public async delete(id: number): Promise<void> {
    const db = await createDB();

    await db.delete('notebooks', id);
  }

  public async getList(
    query: ListQuery
  ): Promise<{ data: INotebook[]; total: number }> {
    const db = await createDB();

    const list = await db.getAll('notebooks');
    const length = list.length;

    const { page, count } = query;
    const start = (page - 1) * count;
    let end = page * count - 1;

    if (start > length) {
      return {
        data: [],
        total: length
      };
    }

    if (end > length) {
      end = length;
    }

    return {
      data: list.slice(start, end + 1),
      total: length
    };
  }
}
