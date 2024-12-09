import { MAX_IMAGE_WIDTH, JPEG_QUALITY } from '../constants/images';

export const handleImageUpload = async (file: File): Promise<string> => {
  try {
    const compressed = await compressImage(file);
    return compressed;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image. Please try with a smaller image.');
  }
};

const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            // Calculate new dimensions
            let { width, height } = img;
            if (width > MAX_IMAGE_WIDTH) {
              height = Math.round((height * MAX_IMAGE_WIDTH) / width);
              width = MAX_IMAGE_WIDTH;
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
            
            resolve(compressed);
          } catch (err) {
            reject(new Error('Failed to compress image'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      } catch (err) {
        reject(new Error('Failed to process image'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};