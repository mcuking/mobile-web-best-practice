import {
  NotebookService,
  INotebookService
} from '../services/notebook-indexDB/request';
import Note from '../entities/note';

import { INotebook, INote } from '@/types';

class NotebookInteractor {
  public static getInstance() {
    return this._instance;
  }

  private static _instance = new NotebookInteractor(new NotebookService());

  constructor(private _service: INotebookService) {}

  public async saveNotebook(payload: INotebook, id: number | undefined) {
    try {
      id
        ? await this._service.edit({ id, ...payload })
        : await this._service.create(payload);
    } catch (error) {
      throw error;
    }
  }

  public async getNotebook(id: number) {
    try {
      const notebook = await this._service.get(id);
      if (notebook) {
        notebook.notes = notebook.notes.map((note) => new Note(note));
        return notebook;
      }
    } catch (error) {
      throw error;
    }
  }

  public async deleteNotebook(id: number) {
    try {
      await this._service.delete(id);
    } catch (error) {
      throw error;
    }
  }

  public async getNotebookList(query: ListQuery) {
    try {
      const { data: notebookList, total } = await this._service.getList(query);

      return {
        data: notebookList.map((notebook) => {
          notebook.notes = notebook.notes.map((note) => new Note(note));
          return notebook;
        }),
        total
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateNoteOrder(notebookId: number, notes: INote[]) {
    try {
      const notebook = await this.getNotebook(notebookId);
      if (notebook) {
        notebook.notes = notes;
        this.saveNotebook(notebook, notebookId);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default NotebookInteractor.getInstance();
