declare global {
    interface Window {
        xxdkBasePath: URL;
        xxdkWasmExecBlobURL: URL;
    }
}
export declare const xxdk_s3_path = "https://elixxir-bins.s3-us-west-1.amazonaws.com/wasm/";
export declare const default_xxdk_path: URL;
export declare let xxdkBasePath: URL | undefined;
export declare function setXXDKBasePath(newPath: URL): void;
export declare function logFileWorkerPath(): Promise<URL>;
export declare function channelsIndexedDbWorkerPath(): Promise<URL>;
export declare function dmIndexedDbWorkerPath(): Promise<URL>;
export declare function stateIndexedDbWorkerPath(): Promise<URL>;
