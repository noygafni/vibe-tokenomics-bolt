import React from "react";
import { studio } from "../../mock-data";
// import { useStudioStore } from '../lib/store';

function Settings() {
  const {
    studioName,
    backgroundColor,
    topBarColor,
    sidebarColor,
    setStudioName,
    setBackgroundColor,
    setTopBarColor,
    setSidebarColor,
  } = studio;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <div className="bg-white rounded-lg p-6 space-y-6 max-w-2xl">
        <div>
          <label
            htmlFor="studioName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Studio Name
          </label>
          <input
            type="text"
            id="studioName"
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="backgroundColor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Background Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              id="backgroundColor"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="topBarColor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Top Bar Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              id="topBarColor"
              value={topBarColor}
              onChange={(e) => setTopBarColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer"
            />
            <input
              type="text"
              value={topBarColor}
              onChange={(e) => setTopBarColor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="sidebarColor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sidebar Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              id="sidebarColor"
              value={sidebarColor}
              onChange={(e) => setSidebarColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer"
            />
            <input
              type="text"
              value={sidebarColor}
              onChange={(e) => setSidebarColor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
