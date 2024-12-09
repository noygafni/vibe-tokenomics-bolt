import React from 'react';
import { Upload } from 'lucide-react';
import { handleImageUpload } from '../utils/imageUpload';

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, label = 'Upload Image', className = '' }) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await handleImageUpload(file);
        onUpload(compressedImage);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <Upload size={20} />
      <span>{label}</span>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
};