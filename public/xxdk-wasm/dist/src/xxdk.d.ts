import type { XXDKUtils } from './types';
type Logger = {
    StopLogging: () => void;
    GetFile: () => Promise<string>;
    Threshold: () => number;
    MaxSize: () => number;
    Size: () => Promise<number>;
    Worker: () => Worker;
};
declare global {
    interface Window extends XXDKUtils {
        onWasmInitialized: () => void;
        Crash: () => void;
        GetLogger: () => Logger;
        logger?: Logger;
        getCrashedLogFile: () => Promise<string>;
        Go: any;
    }
}
export declare const InitXXDK: () => Promise<XXDKUtils>;
export {};
