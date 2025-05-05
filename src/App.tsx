import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import VentureDetails from "./pages/VentureDetails";
import Creators from "./pages/Creators";
import CreatorDetails from "./pages/CreatorDetails";
import SmartContractDetails from "./pages/SmartContractDetails";
import Settings from "./pages/Settings";
import { studio } from "../mock-data";
// import { useStudioStore } from "./lib/store";
import VibeLogo from "./assets/logo.png";
import { AuthGuard } from "./components/AuthGuard";
import {AuthPage} from "./pages/AuthPage";

function App() {
  const { backgroundColor, studioName, topBarColor } = studio;

  return (
    <Router>
      <div
        className="flex min-h-screen overflow-hidden"
        style={{ backgroundColor }}
      >
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div
            className="p-4 flex justify-between items-center overflow-hidden"
            style={{ backgroundColor: topBarColor }}
          >
            <img
              src={VibeLogo}
              width={120}
              height={40}
              className="absolute top-0 left-0 m-6"
            />
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search everything..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
          </div>
          <div className="p-8 pb-0 overflow-hidden">
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={<AuthGuard component={Dashboard}/>} />
              <Route path="/ventures/:id" element={<AuthGuard component={VentureDetails}/>} />
              <Route path="/creators" element={<AuthGuard component={Creators}/>} />
              <Route path="/creators/:id" element={<AuthGuard component={CreatorDetails}/>} />
              <Route path="/contracts/:id" element={<AuthGuard component={SmartContractDetails}/>} />
              <Route path="/settings" element={<AuthGuard component={Settings}/>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
