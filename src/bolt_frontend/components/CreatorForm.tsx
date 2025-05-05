import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import type { Creator } from '../types/creator';

interface CreatorFormProps {
  initialData?: Creator | null;
  onSubmit: (data: Omit<Creator, 'id'>) => void;
  onCancel: () => void;
}

export const CreatorForm: React.FC<CreatorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    imageUrl: initialData?.imageUrl || '',
    bio: initialData?.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-sage-900">
          {initialData ? 'Edit Creator' : 'New Creator'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-sage-500 hover:text-sage-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-1">
          Profile Picture
        </label>
        <div className="mt-1 flex items-center gap-4">
          {formData.imageUrl ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden">
              <img
                src={formData.imageUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                ×
              </button>
            </div>
          ) : (
            <ImageUpload
              onUpload={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
              className="w-32 h-32 border-2 border-dashed border-sage-300 rounded-lg flex flex-col items-center justify-center text-sage-500 hover:border-coral-500 hover:text-coral-500"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-1">
          Short Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full px-3 py-2 border border-sage-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sage-600 hover:text-sage-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-full"
        >
          {initialData ? 'Save Changes' : 'Create Creator'}
        </button>
      </div>
    </form>
  );
};