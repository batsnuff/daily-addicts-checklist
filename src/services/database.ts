import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DailyData, WeeklyData } from '../types';

// IndexedDB setup for offline storage
const DB_NAME = 'DailyAddictsDB';
const DB_VERSION = 1;
const STORES = {
  DAILY_DATA: 'dailyData',
  WEEKLY_DATA: 'weeklyData',
  SYNC_QUEUE: 'syncQueue',
  USER_SETTINGS: 'userSettings'
};

class DatabaseService {
  private db: IDBDatabase | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    this.initIndexedDB();
    this.setupOnlineOfflineListeners();
  }

  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains(STORES.DAILY_DATA)) {
          const dailyStore = db.createObjectStore(STORES.DAILY_DATA, { keyPath: 'id' });
          dailyStore.createIndex('date', 'date', { unique: true });
        }
        
        if (!db.objectStoreNames.contains(STORES.WEEKLY_DATA)) {
          const weeklyStore = db.createObjectStore(STORES.WEEKLY_DATA, { keyPath: 'id' });
          weeklyStore.createIndex('weekStart', 'weekStart', { unique: true });
        }
        
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains(STORES.USER_SETTINGS)) {
          db.createObjectStore(STORES.USER_SETTINGS, { keyPath: 'key' });
        }
      };
    });
  }

  private setupOnlineOfflineListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // IndexedDB operations
  private async addToIndexedDB(storeName: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async updateInIndexedDB(storeName: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getFromIndexedDB(storeName: string, key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllFromIndexedDB(storeName: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync operations
  private async addToSyncQueue(operation: string, data: any): Promise<void> {
    const syncItem = {
      operation,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    await this.addToIndexedDB(STORES.SYNC_QUEUE, syncItem);
  }

  private async syncData(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      const syncQueue = await this.getAllFromIndexedDB(STORES.SYNC_QUEUE);
      const pendingItems = syncQueue.filter(item => !item.synced);
      
      for (const item of pendingItems) {
        await this.processSyncItem(item);
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processSyncItem(item: any): Promise<void> {
    try {
      switch (item.operation) {
        case 'saveDailyData':
          await this.saveDailyDataToFirebase(item.data);
          break;
        case 'saveWeeklyData':
          await this.saveWeeklyDataToFirebase(item.data);
          break;
        // Add more operations as needed
      }
      
      // Mark as synced and update in IndexedDB
      const updatedItem = { ...item, synced: true };
      await this.updateInIndexedDB(STORES.SYNC_QUEUE, updatedItem);
    } catch (error) {
      console.error('Error processing sync item:', error);
      throw error; // Re-throw to handle in syncData
    }
  }

  // Firebase operations
  private async saveDailyDataToFirebase(data: DailyData): Promise<void> {
    const docRef = doc(db, 'dailyData', data.date);
    await setDoc(docRef, {
      ...data,
      lastModified: serverTimestamp()
    });
  }

  private async saveWeeklyDataToFirebase(data: WeeklyData): Promise<void> {
    const docRef = doc(db, 'weeklyData', data.weekStart);
    await setDoc(docRef, {
      ...data,
      lastModified: serverTimestamp()
    });
  }

  private async loadDailyDataFromFirebase(date: string): Promise<DailyData | null> {
    const docRef = doc(db, 'dailyData', date);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DailyData;
    }
    return null;
  }

  private async loadWeeklyDataFromFirebase(weekStart: string): Promise<WeeklyData | null> {
    const docRef = doc(db, 'weeklyData', weekStart);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as WeeklyData;
    }
    return null;
  }

  // Public API methods
  async saveDailyData(data: DailyData): Promise<void> {
    try {
      // Save to IndexedDB first (always available)
      await this.updateInIndexedDB(STORES.DAILY_DATA, {
        id: data.date,
        ...data,
        lastModified: new Date().toISOString()
      });
      
      // Add to sync queue
      await this.addToSyncQueue('saveDailyData', data);
      
      // Try to sync immediately if online
      if (this.isOnline) {
        await this.syncData();
      }
    } catch (error) {
      console.error('Error saving daily data:', error);
      throw error;
    }
  }

  async loadDailyData(date: string): Promise<DailyData | null> {
    try {
      // First try IndexedDB (faster, always available)
      const localData = await this.getFromIndexedDB(STORES.DAILY_DATA, date);
      if (localData) {
        return localData;
      }
      
      // If not found locally and online, try Firebase
      if (this.isOnline) {
        const firebaseData = await this.loadDailyDataFromFirebase(date);
        if (firebaseData) {
          // Save to IndexedDB for future use
          await this.updateInIndexedDB(STORES.DAILY_DATA, {
            id: date,
            ...firebaseData
          });
          return firebaseData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading daily data:', error);
      return null;
    }
  }

  async saveWeeklyData(data: WeeklyData): Promise<void> {
    try {
      // Save to IndexedDB first
      await this.updateInIndexedDB(STORES.WEEKLY_DATA, {
        id: data.weekStart,
        ...data,
        lastModified: new Date().toISOString()
      });
      
      // Add to sync queue
      await this.addToSyncQueue('saveWeeklyData', data);
      
      // Try to sync immediately if online
      if (this.isOnline) {
        await this.syncData();
      }
    } catch (error) {
      console.error('Error saving weekly data:', error);
      throw error;
    }
  }

  async loadWeeklyData(weekStart: string): Promise<WeeklyData | null> {
    try {
      // First try IndexedDB
      const localData = await this.getFromIndexedDB(STORES.WEEKLY_DATA, weekStart);
      if (localData) {
        return localData;
      }
      
      // If not found locally and online, try Firebase
      if (this.isOnline) {
        const firebaseData = await this.loadWeeklyDataFromFirebase(weekStart);
        if (firebaseData) {
          // Save to IndexedDB for future use
          await this.updateInIndexedDB(STORES.WEEKLY_DATA, {
            id: weekStart,
            ...firebaseData
          });
          return firebaseData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading weekly data:', error);
      return null;
    }
  }

  async getAllDailyData(): Promise<DailyData[]> {
    try {
      const localData = await this.getAllFromIndexedDB(STORES.DAILY_DATA);
      return localData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error loading all daily data:', error);
      return [];
    }
  }

  async getSyncStatus(): Promise<{ isOnline: boolean; pendingSync: number }> {
    try {
      const syncQueue = await this.getAllFromIndexedDB(STORES.SYNC_QUEUE);
      const pendingSync = syncQueue.filter(item => !item.synced).length;
      
      return {
        isOnline: this.isOnline,
        pendingSync
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return { isOnline: false, pendingSync: 0 };
    }
  }

  async forceSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncData();
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;
