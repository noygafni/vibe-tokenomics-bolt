import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { studio } from "../../mock-data";
// import { useStudioStore } from '../lib/store';
import chevronClose from "../assets/chevron-open.png";
import chevronOpen from "../assets/chevron-closed.png";
import { useAuth } from "../hooks/useAuth";

function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, sidebarColor } = studio;
  const {isLoggedIn, signOut} = useAuth()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  if (!isLoggedIn){
    return null
  }
  return (
    <div
      className={`border-r pt-14 border-gray-200 transition-all duration-300 ${
        isSidebarOpen ? "w-[60px]" : "w-40"
      }`}
      style={{ backgroundColor: sidebarColor }}
    >
      <div className=" pl-[17px] flex border-b border-gray-200">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="p-1 opacity-80 hover:opacity-100 rounded-lg transition-colors mt-4"
        >
          {isSidebarOpen ? (
            <img
              src={chevronClose}
              className="w-auto h-4 pl-1 transition-all"
            />
          ) : (
            <img src={chevronOpen} className="w-auto h-4 transition-all" />
          )}
        </button>
      </div>
      <nav className="p-6 space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 rounded-full h-8 w-8 hover:saturate-150 hover:scale-[120%] transition-all ${
              isActive
                ? "bg-[#a2c5bf] text-[#a2c5bf]"
                : "bg-[#f2dfc6] text-[#4d4d4d]"
            }`
          }
        >
          {/* <LayoutDashboard size={20} /> */}
          {!isSidebarOpen && <span className="ml-10">Dashboard</span>}
        </NavLink>
        <NavLink
          to="/creators"
          className={({ isActive }) =>
            `flex items-center space-x-3 rounded-full h-8 w-8 hover:saturate-150 hover:scale-[120%] transition-all ${
              isActive
                ? "bg-[#a2c5bf] text-[#a2c5bf]"
                : "bg-[#f2dfc6] text-[#4d4d4d]"
            }`
          }
        >
          {/* <Users size={20} /> */}
          {!isSidebarOpen && <span className="ml-10">Creators</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 rounded-full h-8 w-8 hover:saturate-150 hover:scale-[120%] transition-all ${
              isActive
                ? "bg-[#a2c5bf] text-[#a2c5bf]"
                : "bg-[#f2dfc6] text-[#4d4d4d]"
            }`
          }
        >
          {/* <Settings size={20} /> */}
          {!isSidebarOpen && <span className="ml-10">Settings</span>}
          {/* <div
            className={`rounded-full h-8 w-8 ${
              isActive ? "bg-[#a2c5bf]" : "bg-[#f2dfc6]"
            }`}
          /> */}
        </NavLink>
        <NavLink
          to="#"
          onClick={signOut}
        >
          {/* <Settings size={20} /> */}
          {/* {!isSidebarOpen && <span className="ml-10">Logout</span>} */}
          {/* <div
            className={`rounded-full h-8 w-8 ${
              isActive ? "bg-[#a2c5bf]" : "bg-[#f2dfc6]"
            }`}
          /> */}
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
