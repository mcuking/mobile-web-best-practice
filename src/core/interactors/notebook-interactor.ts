import {
  NotebookService,
  INotebookService
} from '../services/notebook-indexDB/request';
import Note from '../entities/note';

import { INotebook, INote } from '@/types';

class NotebookInteractor {
  constructor(private notebookService: INotebookService) {}

  public async saveNotebook(payload: INotebook, id: number | undefined) {
    try {
      id
        ? await this.notebookService.edit({ id, ...payload })
        : await this.notebookService.create(payload);
    } catch (error) {
      throw error;
    }
  }

  public async getNotebook(id: number) {
    try {
      const notebook = await this.notebookService.get(id);
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
      await this.notebookService.delete(id);
    } catch (error) {
      throw error;
    }
  }

  public async getNotebookList(query: ListQuery) {
    try {
      const { data: notebookList, total } = await this.notebookService.getList(
        query
      );

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

const notebookInteractor = new NotebookInteractor(new NotebookService());

export default notebookInteractor;
