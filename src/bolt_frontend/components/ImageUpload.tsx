import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  label = 'Upload Image', 
  className = '',
  children
}) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          onUpload(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <label className={`inline-flex items-center justify-center cursor-pointer ${className}`}>
      {children || (
        <>
          <Upload size={20} className="mr-2" />
          <span>{label}</span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
};