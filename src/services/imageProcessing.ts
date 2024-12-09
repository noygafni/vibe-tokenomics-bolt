import { MAX_IMAGE_WIDTH, JPEG_QUALITY, MAX_FILE_SIZE } from '../constants/images';

class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

export const processImage = async (file: File): Promise<string> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageProcessingError(`Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  const imageUrl = await readFileAsDataURL(file);
  const compressed = await compressImage(imageUrl);
  return compressed;
};

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new ImageProcessingError('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

const compressImage = async (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const compressed = compressImageToCanvas(img);
        resolve(compressed);
      } catch (error) {
        reject(new ImageProcessingError('Failed to compress image'));
      }
    };
    img.onerror = () => reject(new ImageProcessingError('Failed to load image'));
    img.src = dataUrl;
  });
};

const compressImageToCanvas = (img: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new ImageProcessingError('Failed to get canvas context');
  }

  const { width, height } = calculateDimensions(img.width, img.height);
  
  canvas.width = width;
  canvas.height = height;
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
};

const calculateDimensions = (width: number, height: number) => {
  if (width <= MAX_IMAGE_WIDTH) {
    return { width, height };
  }
  
  const aspectRatio = height / width;
  return {
    width: MAX_IMAGE_WIDTH,
    height: Math.round(MAX_IMAGE_WIDTH * aspectRatio),
  };
};