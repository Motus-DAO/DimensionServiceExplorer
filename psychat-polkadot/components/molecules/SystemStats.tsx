import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HoloPanel, HoloText } from "../ui";
import { FaMicrochip, FaMemory, FaHdd, FaNetworkWired, FaThermometerHalf } from "react-icons/fa";

interface SystemMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "stable";
}

interface SystemStatsProps {
  className?: string;
  compact?: boolean;
}

export const SystemStats: React.FC<SystemStatsProps> = ({
  className,
  compact = false
}) => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: "cpu",
      label: "CPU Usage",
      value: 78,
      unit: "%",
      icon: <FaMicrochip className="text-cyan-400" />,
      color: "text-cyan-400",
      trend: "up"
    },
    {
      id: "memory",
      label: "Memory",
      value: 64,
      unit: "%",
      icon: <FaMemory className="text-fuchsia-400" />,
      color: "text-fuchsia-400",
      trend: "stable"
    },
    {
      id: "storage",
      label: "Storage",
      value: 42,
      unit: "%",
      icon: <FaHdd className="text-green-400" />,
      color: "text-green-400",
      trend: "down"
    },
    {
      id: "network",
      label: "Network",
      value: 156,
      unit: "Mbps",
      icon: <FaNetworkWired className="text-yellow-400" />,
      color: "text-yellow-400",
      trend: "up"
    },
    {
      id: "temperature",
      label: "Temperature",
      value: 67,
      unit: "°C",
      icon: <FaThermometerHalf className="text-red-400" />,
      color: "text-red-400",
      trend: "stable"
    }
  ]);

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
        trend: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable"
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: SystemMetric["trend"]) => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      case "stable": return "→";
    }
  };

  const getTrendColor = (trend: SystemMetric["trend"]) => {
    switch (trend) {
      case "up": return "text-green-400";
      case "down": return "text-red-400";
      case "stable": return "text-yellow-400";
    }
  };

  const getBarColor = (value: number, metricId: string) => {
    if (metricId === "temperature") {
      return value > 80 ? "bg-red-400" : value > 60 ? "bg-yellow-400" : "bg-green-400";
    }
    return value > 80 ? "bg-red-400" : value > 60 ? "bg-yellow-400" : "bg-cyan-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`motion-crystal-hover ${className}`}
    >
      <HoloPanel variant="floating" size={compact ? "md" : "lg"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaMicrochip className="text-cyan-400 text-xl" />
            <HoloText size={compact ? "base" : "lg"} weight="bold">
              System Performance
            </HoloText>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
          />
        </div>

        {/* Metrics Grid */}
        <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-black/20 rounded-lg p-3 border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {metric.icon}
                  <span className="text-white/80 text-sm font-medium">
                    {metric.label}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <motion.span
                  key={metric.value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className={`text-xl font-bold font-mono ${metric.color}`}
                >
                  {Math.round(metric.value)}
                  <span className="text-sm text-white/60 ml-1">{metric.unit}</span>
                </motion.span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full ${getBarColor(metric.value, metric.id)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <div className="mt-4 pt-3 border-t border-cyan-400/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/80">System Operational</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xs text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors"
            >
              View Details
            </motion.div>
          </div>
        </div>
      </HoloPanel>
    </motion.div>
  );
};
