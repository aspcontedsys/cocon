import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  
  private _storage: Storage | null = null;
  private _storageReadyPromise: Promise<void>; // Promise to track storage initialization

  constructor(private storage: Storage) {
    // Initialize the storage and store the promise
    this._storageReadyPromise = this.init();
  }

  private async init(): Promise<void> {
    try {
      this._storage = await this.storage.create();
      console.log('Ionic Storage initialized successfully.');
    } catch (error) {
      console.error('Error initializing Ionic Storage:', error);
      // Depending on your error handling strategy, you might want to re-throw
      // or handle this more gracefully (e.g., disable token operations).
    }
  }

  // Wait for storage to be ready
  private async ensureStorageReady(): Promise<void> {
    if (!this._storage) {
      await this._storageReadyPromise;
    }
  }

  // Set a value
  public async set(key: string, value: any): Promise<void> {
    await this.ensureStorageReady();
    if (!this._storage) {
      throw new Error('Storage not initialized');
    }
    await this._storage.set(key, value);
  }

  // Get a value
  public async get(key: string): Promise<any> {
    await this.ensureStorageReady();
    if (!this._storage) {
      throw new Error('Storage not initialized');
    }
    return this._storage.get(key);
  }

  // Remove a value
  public async remove(key: string): Promise<void> {
    await this.ensureStorageReady();
    if (!this._storage) {
      throw new Error('Storage not initialized');
    }
    await this._storage.remove(key);
  }

  // Clear all keys
  public async clear(): Promise<void> {
    await this.ensureStorageReady();
    if (!this._storage) {
      throw new Error('Storage not initialized');
    }
    await this._storage.clear();

  }
}
