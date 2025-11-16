import React from "react";
import Link from "next/link";
import { HoloText } from "./ui";
import { FaHome, FaPlay, FaTerminal, FaUser, FaGlobe } from "react-icons/fa";

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-4 left-4 z-50">
      <div className="bg-black/20 backdrop-blur-xl border border-cyan-400/20 rounded-xl p-4">
        <div className="flex flex-col space-y-3">
          <Link href="/">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer">
              <FaHome className="text-cyan-400" />
              <HoloText size="sm" weight="normal">Home</HoloText>
            </div>
          </Link>
          
          <Link href="/playground">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-fuchsia-500/10 transition-colors cursor-pointer">
              <FaPlay className="text-fuchsia-400" />
              <HoloText size="sm" weight="normal">Playground</HoloText>
            </div>
          </Link>
          
          <Link href="/holo">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer">
              <FaTerminal className="text-cyan-400" />
              <HoloText size="sm" weight="normal">Holo Terminal</HoloText>
            </div>
          </Link>

          <Link href="/fractales">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer">
              <FaGlobe className="text-cyan-400" />
              <HoloText size="sm" weight="normal">Fractales</HoloText>
            </div>
          </Link>
          
          <Link href="/profile">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-fuchsia-500/10 transition-colors cursor-pointer">
              <FaUser className="text-fuchsia-400" />
              <HoloText size="sm" weight="normal">Profile</HoloText>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};
