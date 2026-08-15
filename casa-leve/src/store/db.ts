/**
 * Camada fina sobre o IndexedDB. Sem dependencias externas e com um adaptador
 * em memoria para ambientes sem IndexedDB (SSR, build estatico, testes).
 */

export const DB_NAME = 'casa-leve';
export const DB_VERSION = 1;

export const STORES = {
  completions: 'instanceId',
  settings: 'id',
  hotspots: 'id',
  zonePicks: 'weekKey',
  laundry: 'id',
  meals: 'date',
  dayFlags: 'date',
} as const;

export type StoreName = keyof typeof STORES;

export interface Persistence {
  getAll<T>(store: StoreName): Promise<T[]>;
  put<T>(store: StoreName, value: T): Promise<void>;
  remove(store: StoreName, key: string): Promise<void>;
  clear(store: StoreName): Promise<void>;
  reset(): Promise<void>;
}

function hasIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined';
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);
    open.onupgradeneeded = () => {
      const db = open.result;
      for (const [name, keyPath] of Object.entries(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath });
        }
      }
    };
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
}

class IndexedDbPersistence implements Persistence {
  private db: Promise<IDBDatabase> | null = null;

  private connect(): Promise<IDBDatabase> {
    if (!this.db) {
      this.db = openDatabase().catch((error) => {
        // Modo privado, iframe com restricoes, quota cheia: a casa continua
        // a funcionar nesta sessao, apenas sem guardar entre aberturas.
        this.db = null;
        throw error;
      });
    }
    return this.db;
  }

  private async tx(store: StoreName, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.connect();
    return db.transaction(store, mode).objectStore(store);
  }

  async getAll<T>(store: StoreName): Promise<T[]> {
    const objectStore = await this.tx(store, 'readonly');
    return request(objectStore.getAll() as IDBRequest<T[]>);
  }

  async put<T>(store: StoreName, value: T): Promise<void> {
    const objectStore = await this.tx(store, 'readwrite');
    await request(objectStore.put(value));
  }

  async remove(store: StoreName, key: string): Promise<void> {
    const objectStore = await this.tx(store, 'readwrite');
    await request(objectStore.delete(key));
  }

  async clear(store: StoreName): Promise<void> {
    const objectStore = await this.tx(store, 'readwrite');
    await request(objectStore.clear());
  }

  async reset(): Promise<void> {
    for (const store of Object.keys(STORES) as StoreName[]) {
      await this.clear(store);
    }
  }
}

class MemoryPersistence implements Persistence {
  private data = new Map<StoreName, Map<string, unknown>>();

  private bucket(store: StoreName): Map<string, unknown> {
    let bucket = this.data.get(store);
    if (!bucket) {
      bucket = new Map();
      this.data.set(store, bucket);
    }
    return bucket;
  }

  async getAll<T>(store: StoreName): Promise<T[]> {
    return [...this.bucket(store).values()] as T[];
  }

  async put<T>(store: StoreName, value: T): Promise<void> {
    const keyPath = STORES[store];
    const key = String((value as Record<string, unknown>)[keyPath]);
    this.bucket(store).set(key, value);
  }

  async remove(store: StoreName, key: string): Promise<void> {
    this.bucket(store).delete(key);
  }

  async clear(store: StoreName): Promise<void> {
    this.bucket(store).clear();
  }

  async reset(): Promise<void> {
    this.data.clear();
  }
}

let instance: Persistence | null = null;

/**
 * Se o IndexedDB existir mas recusar abrir, passamos para memoria em vez de
 * deixar a aplicacao a meio: marcar tarefas continua a funcionar.
 */
class ResilientPersistence implements Persistence {
  private primary: Persistence = new IndexedDbPersistence();
  private fallback: MemoryPersistence | null = null;

  private async run<T>(action: (store: Persistence) => Promise<T>): Promise<T> {
    if (this.fallback) return action(this.fallback);
    try {
      return await action(this.primary);
    } catch {
      this.fallback = new MemoryPersistence();
      return action(this.fallback);
    }
  }

  getAll<T>(store: StoreName): Promise<T[]> {
    return this.run((db) => db.getAll<T>(store));
  }

  put<T>(store: StoreName, value: T): Promise<void> {
    return this.run((db) => db.put(store, value));
  }

  remove(store: StoreName, key: string): Promise<void> {
    return this.run((db) => db.remove(store, key));
  }

  clear(store: StoreName): Promise<void> {
    return this.run((db) => db.clear(store));
  }

  reset(): Promise<void> {
    return this.run((db) => db.reset());
  }
}

export function getPersistence(): Persistence {
  if (!instance) {
    instance = hasIndexedDb() ? new ResilientPersistence() : new MemoryPersistence();
  }
  return instance;
}

/** Util para testes: injeta uma implementacao alternativa. */
export function setPersistence(next: Persistence | null): void {
  instance = next;
}
