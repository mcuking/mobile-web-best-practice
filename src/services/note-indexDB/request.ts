import createDB from '@/utils/create-indexDB';

import { INote } from '@/types';

export interface INoteService {
  create(payload: INote, notebookId: number): Promise<void>;
  edit(payload: INote, notebookId: number): Promise<void>;
  get(notebookId: number, id: number): Promise<INote | undefined>;
  delete(notebookId: number, id: number): Promise<void>;
}

export class NoteService implements INoteService {
  public async create(payload: INote, notebookId: number): Promise<void> {
    const db = await createDB();

    const notebook = await db.getFromIndex('notebooks', 'id', notebookId);
    if (notebook) {
      notebook.notes.push(payload);
      await db.put('notebooks', notebook);
    }
  }

  public async edit(payload: INote, notebookId: number): Promise<void> {
    const db = await createDB();

    const { id } = payload;
    const notebook = await db.getFromIndex('notebooks', 'id', notebookId);
    if (notebook) {
      const index = notebook.notes.findIndex((note) => note.id === id);
      notebook.notes[index] = Object.assign({}, notebook.notes[index], payload);
      await db.put('notebooks', notebook);
    }
  }

  public async get(notebookId: number, id: number): Promise<INote | undefined> {
    const db = await createDB();

    const notebook = await db.getFromIndex('notebooks', 'id', notebookId);
    if (notebook) {
      const note = notebook.notes.find((item) => item.id === id);
      return note;
    }
  }

  public async delete(notebookId: number, id: number): Promise<void> {
    const db = await createDB();

    const notebook = await db.getFromIndex('notebooks', 'id', notebookId);
    if (notebook) {
      notebook.notes = notebook.notes.filter((note) => note.id !== id);
      await db.put('notebooks', notebook);
    }
  }
}
