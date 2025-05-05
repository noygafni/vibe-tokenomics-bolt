import React from 'react';
import { Header } from '../components/Header';
import { VentureList } from '../components/VentureList';
import { FloatingMenu } from '../components/FloatingMenu';
import { useVentureStore } from '../store/useVentureStore';
import { useAuth } from '../hooks/useAuth';

export const HomePage: React.FC = () => {
  const backgroundImage = useVentureStore((state) => state.backgroundImage);
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcedda' }}>
      <div
        className="fixed inset-0 -z-10 opacity-50"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: '#fcedda' }} />
      </div>
      <Header />
      <VentureList />
      {user && <FloatingMenu />}
    </div>
  );
};