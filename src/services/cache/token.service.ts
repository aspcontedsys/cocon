import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private _storage: Storage | null = null;
  private _storageReadyPromise: Promise<void>; // Promise to track storage initialization

  constructor(private storage: Storage) {
    // Initialize the storage and store the promise
    this._storageReadyPromise = this.init();
  }

  /**
   * Initializes the Ionic Storage.
   * This method is called once in the constructor and sets up a promise
   * that resolves when the storage is ready.
   */
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

  /**
   * Ensures the storage is ready before proceeding with any operation.
   * This method will await the _storageReadyPromise.
   */
  private async ensureStorageReady(): Promise<void> {
    if (!this._storage) {
      await this._storageReadyPromise;
    }
  }

  /**
   * Sets the authentication token in storage.
   * @param token The token string to store.
   */
  async setToken(token: string): Promise<void> {
    await this.ensureStorageReady();
    if (this._storage) {
      await this._storage.set('Remedi_OP_Token', token);
      console.log('Token set successfully.');
    } else {
      console.error('Storage not available to set token.');
    }
  }

  /**
   * Retrieves the authentication token from storage.
   * @returns A Promise that resolves with the token string or null if not found.
   */
  async getToken(): Promise<string | null> {
    await this.ensureStorageReady();
    if (this._storage) {
      const token = await this._storage.get('Remedi_OP_Token');
      console.log('Token retrieved:', token ? 'Exists' : 'Does not exist');
      return token;
    } else {
      console.error('Storage not available to get token.');
      return null;
    }
  }

  /**
   * Removes the authentication token from storage.
   */
  async removeToken(): Promise<void> {
    await this.ensureStorageReady();
    if (this._storage) {
      await this._storage.remove('Remedi_OP_Token');
      console.log('Token removed successfully.');
    } else {
      console.error('Storage not available to remove token.');
    }
  }

  /**
   * Clears all data from the storage.
   */
  async clearStorage(): Promise<void> {
    await this.ensureStorageReady();
    if (this._storage) {
      await this._storage.clear();
      console.log('Storage cleared successfully.');
    } else {
      console.error('Storage not available to clear.');
    }
  }
}
