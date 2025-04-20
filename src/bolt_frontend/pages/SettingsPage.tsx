import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, Image, Palette } from 'lucide-react';
import { useVentureStore } from '../store/useVentureStore';
import { exportData, importData } from '../utils/dataOperations';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  const { ventures, creators, importVentures, setBackgroundImage, setBackgroundColor, backgroundImage, backgroundColor } = useVentureStore();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importData(file);
      importVentures(importedData);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcedda' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sage-700 hover:text-sage-900 transition-colors"
          >
            <ArrowLeft size={24} />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-light text-sage-900">Settings</h1>
        </div>

        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-sage-200/50 shadow-sm">
            <h2 className="text-2xl font-bold text-sage-900 mb-6">Data Management</h2>
            <div className="flex gap-4">
              <button
                onClick={() => exportData({ ventures, creators, backgroundImage, backgroundColor })}
                className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-700 rounded-xl border border-green-500/30 transition-colors"
              >
                <Upload size={20} />
                Export Data
              </button>
              
              <label className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 rounded-xl border border-blue-500/30 transition-colors cursor-pointer">
                <Download size={20} />
                Import Data
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-sage-200/50 shadow-sm">
            <h2 className="text-2xl font-bold text-sage-900 mb-6">Appearance</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 rounded-xl border border-purple-500/30 transition-colors cursor-pointer inline-flex">
                <Image size={20} />
                Change Background Image
                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-2 px-6 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-700 rounded-xl border border-orange-500/30 transition-colors cursor-pointer inline-flex">
                <Palette size={20} />
                Change Background Color
                <input
                  ref={colorInputRef}
                  type="color"
                  defaultValue="#fcedda"
                  onChange={handleColorChange}
                  className="ml-2 w-8 h-8 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};