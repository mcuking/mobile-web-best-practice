import { openDB, DBSchema } from 'idb';

import { INotebook } from '@/types';

interface NoteDB extends DBSchema {
  notebooks: {
    value: INotebook;
    key: number;
    indexes: {
      id: number;
    };
  };
}

export default async function createDB() {
  const db = await openDB<NoteDB>('notes', 2, {
    upgrade(db2) {
      const notebookStore = db2.createObjectStore('notebooks', {
        keyPath: 'id',
        autoIncrement: true
      });
      notebookStore.createIndex('id', 'id', {
        unique: true
      });
    }
  });

  return db;
}
