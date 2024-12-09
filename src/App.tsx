import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { VenturePage } from './pages/VenturePage';
import { SettingsPage } from './pages/SettingsPage';
import { WalletPage } from './pages/WalletPage';
import { CreatorsPage } from './pages/CreatorsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/venture/:id" element={<VenturePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/creators" element={<CreatorsPage />} />
      </Routes>
    </Router>
  );
}

export default App;