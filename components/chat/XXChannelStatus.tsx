import { motion } from 'framer-motion';

interface XXChannelStatusProps {
  ready: boolean;
  channelId: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  messageCount?: number;
}

export default function XXChannelStatus({ ready, channelId, syncStatus, messageCount = 0 }: XXChannelStatusProps) {
  if (!ready) return null;

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return '⟳';
      case 'synced':
        return '✓';
      case 'error':
        return '✗';
      default:
        return '○';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-cyan-400';
      case 'synced':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getBorderColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'border-cyan-500/50';
      case 'synced':
        return 'border-green-500/50';
      case 'error':
        return 'border-red-500/50';
      default:
        return 'border-cyan-500/30';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'synced':
        return 'Synced';
      case 'error':
        return 'Sync error';
      default:
        return 'Ready';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: syncStatus === 'syncing' ? [1, 1.02, 1] : 1,
      }}
      transition={{
        scale: { duration: 0.6, repeat: syncStatus === 'syncing' ? Infinity : 0 }
      }}
      className={`flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 backdrop-blur-sm border rounded-lg transition-colors duration-300 ${getBorderColor()}`}
    >
      <div className="flex items-center gap-1.5">
        <motion.span
          className={`text-sm font-mono ${getStatusColor()}`}
          animate={{
            rotate: syncStatus === 'syncing' ? 360 : 0,
            scale: syncStatus === 'synced' ? [1, 1.3, 1] : 1,
          }}
          transition={{
            rotate: { duration: 1, repeat: syncStatus === 'syncing' ? Infinity : 0, ease: 'linear' },
            scale: { duration: 0.3, times: [0, 0.5, 1] }
          }}
        >
          {getStatusIcon()}
        </motion.span>
        <span className="text-xs text-gray-300 font-medium">XX Network</span>
      </div>
      
      <div className="h-3 w-px bg-cyan-500/30" />
      
      <div className="flex items-center gap-2">
        <span className={`text-xs ${getStatusColor()}`}>{getStatusText()}</span>
        {channelId && (
          <>
            <span className="text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-mono">
              {messageCount} msgs
            </span>
          </>
        )}
      </div>

      {channelId && (
        <>
          <div className="h-3 w-px bg-cyan-500/30" />
          <span className="text-xs text-gray-500 font-mono truncate max-w-[100px]" title={channelId}>
            {channelId.split('_')[1]?.substring(0, 8)}...
          </span>
        </>
      )}
    </motion.div>
  );
}
