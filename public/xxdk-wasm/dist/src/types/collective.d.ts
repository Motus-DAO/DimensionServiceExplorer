export declare enum AccountSyncStatus {
    NotSynced = "NotSynced",
    Synced = "Synced",
    Ignore = "Ignored"
}
export declare enum AccountSyncService {
    None = "None",
    Google = "Google",
    Dropbox = "Dropbox"
}
export declare enum OperationType {
    Created = 0,
    Updated = 1,
    Deleted = 2
}
export type KVEntry = {
    version: number;
    timestamp: string;
    data: string;
};
type KeyChangedByRemoteCallback = {
    Callback: (key: string, oldEntry: Uint8Array, newEntry: Uint8Array, operationType: OperationType) => void;
};
export declare const KV_VERSION = 0;
export type RemoteKV = {
    Get: (key: string, version: number) => Promise<Uint8Array>;
    Delete: (key: string, version: number) => Promise<void>;
    Set: (key: string, encodedKVMapEntry: Uint8Array) => Promise<void>;
    ListenOnRemoteKey: (key: string, version: number, onChange: KeyChangedByRemoteCallback) => number;
    DeleteRemoteKeyListener: (key: string, id: number) => void;
};
export interface RemoteStoreServiceWrapper {
    service: AccountSyncService;
    Read: (path: string) => Promise<Uint8Array | null>;
    Write: (path: string, data: Uint8Array) => Promise<void>;
    GetLastModified: (path: string) => Promise<string | null>;
    ReadDir: (path: string) => Promise<string[]>;
    DeleteAll: () => Promise<void>;
}
export declare class RemoteStore {
    store: RemoteStoreServiceWrapper;
    lastWrite: string | null;
    service: AccountSyncService;
    constructor(store: RemoteStoreServiceWrapper);
    Read(path: string): Promise<Uint8Array>;
    Write(path: string, data: Uint8Array): Promise<void>;
    GetLastWrite(): string;
    GetLastModified(path: string): Promise<string>;
    ReadDir(path: string): Promise<Uint8Array>;
    DeleteAll(): Promise<void>;
}
export {};
