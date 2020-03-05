import { NoteService, INoteService } from '../services/note-indexDB/request';
import { NativeService, INativeService } from '../services/native/request';
import Note from '../entities/note';

import { INote, SyncCalendarParams } from '@/types';

class NoteInteractor {
  public static getInstance() {
    return this._instance;
  }

  private static _instance = new NoteInteractor(
    new NoteService(),
    new NativeService()
  );

  constructor(
    private _service: INoteService,
    private _service2: INativeService
  ) {}

  public async saveNote(payload: INote, notebookId: number, isEdit: boolean) {
    try {
      if (isEdit) {
        await this._service.edit(payload, notebookId);
      } else {
        await this._service.create(payload, notebookId);
      }
    } catch (error) {
      throw error;
    }
  }

  public async getNote(notebookId: number, id: number) {
    try {
      const note = await this._service.get(notebookId, id);
      if (note) {
        return new Note(note);
      }
    } catch (error) {
      throw error;
    }
  }

  public async deleteNote(notebookId: number, id: number) {
    try {
      await this._service.delete(notebookId, id);
    } catch (error) {
      throw error;
    }
  }

  public async toggleDoneStatus(notebookId: number, id: number) {
    try {
      const note = await this.getNote(notebookId, id);
      if (note) {
        note.isDone = !note.isDone;
        await this.saveNote(note, notebookId, true);
      }
    } catch (error) {
      throw error;
    }
  }

  public async changeSyncStatus(
    notebookId: number,
    id: number,
    status: boolean
  ) {
    try {
      const note = await this.getNote(notebookId, id);
      if (note) {
        note.isSync = status;
        await this.saveNote(note, notebookId, true);
      }
    } catch (error) {
      throw error;
    }
  }

  public async syncCalendar(params: SyncCalendarParams, notebookId: number) {
    const noteId = params.id;
    try {
      await this._service2.syncCalendar(params, async () => {
        await this.changeSyncStatus(notebookId, noteId, true);
      });
    } catch (error) {
      throw error;
    }
  }
}

export default NoteInteractor.getInstance();
