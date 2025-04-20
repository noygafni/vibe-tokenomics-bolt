import { StorageQuotaError } from '../utils/errors';
import { Venture } from '../types/venture';
import { MAX_STORAGE_SIZE } from '../constants/storage';

export class StorageManager {
  private static instance: StorageManager;
  
  private constructor() {}
  
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  getStorageSize(): number {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length * 2;
      }
    }
    return size;
  }

  checkQuota(newData: string): boolean {
    const currentSize = this.getStorageSize();
    const newDataSize = newData.length * 2;
    return (currentSize + newDataSize) <= MAX_STORAGE_SIZE;
  }

  cleanupUnusedImages(ventures: Venture[]): void {
    const usedImages = this.collectUsedImages(ventures);
    this.removeUnusedImages(usedImages);
  }

  private collectUsedImages(ventures: Venture[]): Set<string> {
    const imageUrls = new Set<string>();
    
    ventures.forEach(venture => {
      if (venture.ventureImage) imageUrls.add(venture.ventureImage);
      if (venture.bannerUrl) imageUrls.add(venture.bannerUrl);
      venture.members.forEach(member => {
        if (member.imageUrl) imageUrls.add(member.imageUrl);
      });
    });
    
    return imageUrls;
  }

  private removeUnusedImages(usedImages: Set<string>): void {
    for (const key in localStorage) {
      if (key.startsWith('img_') && !usedImages.has(localStorage[key])) {
        localStorage.removeItem(key);
      }
    }
  }

  async storeWithQuotaCheck(key: string, data: string): Promise<void> {
    if (!this.checkQuota(data)) {
      throw new StorageQuotaError('Storage quota exceeded');
    }
    localStorage.setItem(key, data);
  }
}