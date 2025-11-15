import React from "react";
import { HoloTerminal } from "./index";

/**
 * Demo component showcasing the HoloTerminal organism
 * This demonstrates the full holographic terminal interface
 */
export const HoloTerminalDemo: React.FC = () => {
  const handleConnect = () => {
    console.log("Connect action triggered");
  };

  const handleAnalyze = () => {
    console.log("Analyze action triggered");
  };

  return (
    <div className="min-h-screen bg-black">
      <HoloTerminal
        onConnect={handleConnect}
        onAnalyze={handleAnalyze}
        className="w-full h-screen"
      />
    </div>
  );
};
