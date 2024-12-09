import { Venture } from '../types/venture';

const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB limit for localStorage

export const getStorageSize = (): number => {
  let size = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage[key].length * 2; // UTF-16 characters are 2 bytes each
    }
  }
  return size;
};

export const checkStorageQuota = (data: string): boolean => {
  const currentSize = getStorageSize();
  const newDataSize = data.length * 2;
  return (currentSize + newDataSize) <= MAX_STORAGE_SIZE;
};

export const cleanupOldImages = (ventures: Venture[]): void => {
  const imageUrls = new Set<string>();
  
  // Collect all currently used images
  ventures.forEach(venture => {
    if (venture.ventureImage) imageUrls.add(venture.ventureImage);
    if (venture.bannerUrl) imageUrls.add(venture.bannerUrl);
    venture.members.forEach(member => {
      if (member.imageUrl) imageUrls.add(member.imageUrl);
    });
  });

  // Remove unused images from storage
  for (const key in localStorage) {
    if (key.startsWith('img_') && !imageUrls.has(localStorage[key])) {
      localStorage.removeItem(key);
    }
  }
};