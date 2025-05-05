import { Venture } from '../types/venture';
import { Creator } from '../types/creator';
import { useVentureStore } from '../store/useVentureStore';

interface ExportData {
  ventures: Venture[];
  creators: Creator[];
  backgroundImage: string;
  backgroundColor: string;
}

export const exportData = (data: ExportData) => {
  // Convert dates to ISO strings for JSON serialization
  const processedData = {
    ...data,
    ventures: data.ventures.map(venture => ({
      ...venture,
      createdAt: venture.createdAt.toISOString(),
      updatedAt: venture.updatedAt.toISOString(),
      smartContracts: venture.smartContracts?.map(contract => ({
        ...contract,
        createdAt: contract.createdAt.toISOString(),
        updatedAt: contract.updatedAt.toISOString(),
        signedAt: contract.signedAt?.toISOString(),
      }))
    }))
  };

  const exportData = JSON.stringify(processedData, null, 2);
  const blob = new Blob([exportData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `vibe-studio-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        // Convert date strings back to Date objects
        const processedData = {
          ...data,
          ventures: data.ventures.map((venture: any) => ({
            ...venture,
            createdAt: new Date(venture.createdAt),
            updatedAt: new Date(venture.updatedAt),
            smartContracts: venture.smartContracts?.map((contract: any) => ({
              ...contract,
              createdAt: new Date(contract.createdAt),
              updatedAt: new Date(contract.updatedAt),
              signedAt: contract.signedAt ? new Date(contract.signedAt) : undefined,
            }))
          }))
        };
        
        resolve(processedData);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};