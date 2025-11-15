import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HoloPanel, HoloText } from "../ui";
import { FaWifi, FaEthernet, FaSignal, FaGlobe, FaShieldAlt, FaLock, FaNetworkWired } from "react-icons/fa";
// Removed arciumChatService import - was Solana-specific

interface NetworkInfo {
  status: "online" | "offline" | "connecting";
  type: "wifi" | "ethernet" | "cellular";
  signal: number;
  latency: number;
  speed: string;
  security: "secure" | "insecure" | "unknown";
}

interface ArciumNetworkInfo {
  isConnected: boolean;
  nodeCount: number;
  lastUpdate: number;
  status: "connected" | "disconnected" | "connecting";
}

interface NetworkStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  className,
  showDetails = true
}) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    status: "online",
    type: "wifi",
    signal: 85,
    latency: 24,
    speed: "1.2 Gbps",
    security: "secure"
  });

  const [isConnected, setIsConnected] = useState(true);
  const [arciumNetwork, setArciumNetwork] = useState<ArciumNetworkInfo>({
    isConnected: false,
    nodeCount: 0,
    lastUpdate: 0,
    status: "disconnected"
  });

  // Simulate network status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkInfo(prev => ({
        ...prev,
        signal: Math.max(20, Math.min(100, prev.signal + (Math.random() - 0.5) * 10)),
        latency: Math.max(5, Math.min(100, prev.latency + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Placeholder for network monitoring (to be replaced with Polkadot/XX Network)
  useEffect(() => {
    // Placeholder - will be replaced with Polkadot network status
    setArciumNetwork({
      isConnected: true,
      nodeCount: 0,
      lastUpdate: Date.now(),
      status: "connected"
    });
  }, []);

  const getStatusIcon = (type: NetworkInfo["type"]) => {
    switch (type) {
      case "wifi": return <FaWifi className="text-cyan-400" />;
      case "ethernet": return <FaEthernet className="text-fuchsia-400" />;
      case "cellular": return <FaSignal className="text-green-400" />;
    }
  };

  const getStatusColor = (status: NetworkInfo["status"]) => {
    switch (status) {
      case "online": return "text-green-400";
      case "offline": return "text-red-400";
      case "connecting": return "text-yellow-400";
    }
  };

  const getSignalStrength = (signal: number) => {
    if (signal >= 80) return { bars: 4, color: "text-green-400" };
    if (signal >= 60) return { bars: 3, color: "text-yellow-400" };
    if (signal >= 40) return { bars: 2, color: "text-orange-400" };
    return { bars: 1, color: "text-red-400" };
  };

  const getSecurityIcon = (security: NetworkInfo["security"]) => {
    switch (security) {
      case "secure": return <FaShieldAlt className="text-green-400" />;
      case "insecure": return <FaShieldAlt className="text-red-400" />;
      case "unknown": return <FaShieldAlt className="text-yellow-400" />;
    }
  };

  const signalInfo = getSignalStrength(networkInfo.signal);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`motion-crystal-hover ${className}`}
    >
      <HoloPanel variant="default" size="lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(networkInfo.type)}
            <HoloText size="base" weight="bold">
              Network Status
            </HoloText>
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-3 h-3 rounded-full ${
              networkInfo.status === "online" ? "bg-green-400" : 
              networkInfo.status === "offline" ? "bg-red-400" : "bg-yellow-400"
            }`}
          />
        </div>

        {/* Connection Status */}
        <div className="space-y-3">
          {/* Status Row */}
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Connection</span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getStatusColor(networkInfo.status)}`}>
                {networkInfo.status.charAt(0).toUpperCase() + networkInfo.status.slice(1)}
              </span>
              <motion.div
                animate={{ rotate: networkInfo.status === "connecting" ? 360 : 0 }}
                transition={{ duration: 1, repeat: networkInfo.status === "connecting" ? Infinity : 0 }}
                className="w-4 h-4"
              >
                {getStatusIcon(networkInfo.type)}
              </motion.div>
            </div>
          </div>

          {/* Signal Strength */}
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Signal</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((bar) => (
                  <motion.div
                    key={bar}
                    initial={{ height: 0 }}
                    animate={{ 
                      height: bar <= signalInfo.bars ? "12px" : "4px",
                      opacity: bar <= signalInfo.bars ? 1 : 0.3
                    }}
                    transition={{ duration: 0.5, delay: bar * 0.1 }}
                    className={`w-1 ${signalInfo.color} rounded-full`}
                  />
                ))}
              </div>
              <span className="text-sm text-white/60">{networkInfo.signal}%</span>
            </div>
          </div>

          {showDetails && (
            <>
              {/* Latency */}
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Latency</span>
                <motion.span
                  key={networkInfo.latency}
                  initial={{ scale: 1.1, color: "#00ffff" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium text-cyan-400"
                >
                  {networkInfo.latency}ms
                </motion.span>
              </div>

              {/* Speed */}
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Speed</span>
                <span className="text-sm font-medium text-fuchsia-400">
                  {networkInfo.speed}
                </span>
              </div>

              {/* Security */}
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Security</span>
                <div className="flex items-center space-x-2">
                  {getSecurityIcon(networkInfo.security)}
                  <span className={`text-sm font-medium ${
                    networkInfo.security === "secure" ? "text-green-400" :
                    networkInfo.security === "insecure" ? "text-red-400" : "text-yellow-400"
                  }`}>
                    {networkInfo.security.charAt(0).toUpperCase() + networkInfo.security.slice(1)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Network Activity Indicator */}
        <div className="mt-4 pt-3 border-t border-cyan-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaGlobe className="text-cyan-400 text-sm" />
              <span className="text-sm text-white/80">Mainnet Connected</span>
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-cyan-400 rounded-full"
            />
          </div>
        </div>

        {/* XX Network Status (placeholder) */}
        <div className="mt-4 pt-3 border-t border-purple-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaLock className="text-purple-400 text-sm" />
              <span className="text-sm text-white/80">XX Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-2 h-2 rounded-full ${
                  arciumNetwork.status === "connected" ? "bg-green-400" : 
                  arciumNetwork.status === "connecting" ? "bg-yellow-400" : "bg-red-400"
                }`}
              />
              <span className={`text-xs ${
                arciumNetwork.status === "connected" ? "text-green-400" : 
                arciumNetwork.status === "connecting" ? "text-yellow-400" : "text-red-400"
              }`}>
                {arciumNetwork.status === "connected" ? "Connected" : 
                 arciumNetwork.status === "connecting" ? "Connecting" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </HoloPanel>
    </motion.div>
  );
};
