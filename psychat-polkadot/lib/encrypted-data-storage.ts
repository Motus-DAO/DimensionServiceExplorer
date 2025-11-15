// Simple storage for encrypted conversation data
// Since metadata URI has a 200 character limit, we store the full encrypted data separately

export interface StoredEncryptedData {
  sessionId: string;
  encryptedData: string;
  decryptionKey: string;
  timestamp: number;
  mxeAddress: string;
  walrusCid?: string;
}

/**
 * Store encrypted conversation data locally
 * In production, this would be stored on-chain or in a decentralized storage system
 */
export function storeEncryptedConversation(
  sessionId: string,
  encryptedConversation: {
    encryptedData: string;
    decryptionKey: string;
    timestamp: number;
    mxeAddress: string;
  },
  walrusCid?: string
): void {
  try {
    const storedData: StoredEncryptedData = {
      sessionId,
      encryptedData: encryptedConversation.encryptedData,
      decryptionKey: encryptedConversation.decryptionKey,
      timestamp: encryptedConversation.timestamp,
      mxeAddress: encryptedConversation.mxeAddress,
      walrusCid
    };

    // Store in localStorage for now (in production, this would be on-chain)
    const key = `psychat_encrypted_${sessionId}`;
    localStorage.setItem(key, JSON.stringify(storedData));
    
    console.log('✅ Encrypted conversation data stored locally');
    console.log('Storage key:', key);
    console.log('Data size:', JSON.stringify(storedData).length, 'characters');
  } catch (error) {
    console.error('❌ Failed to store encrypted conversation:', error);
  }
}

/**
 * Retrieve encrypted conversation data
 */
export function getEncryptedConversation(sessionId: string): StoredEncryptedData | null {
  try {
    const key = `psychat_encrypted_${sessionId}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }
    
    return JSON.parse(stored) as StoredEncryptedData;
  } catch (error) {
    console.error('❌ Failed to retrieve encrypted conversation:', error);
    return null;
  }
}

/**
 * List all stored encrypted conversations
 */
export function listStoredConversations(): StoredEncryptedData[] {
  try {
    const conversations: StoredEncryptedData[] = [];
    
    // Iterate through localStorage to find all encrypted conversations
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('psychat_encrypted_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            conversations.push(JSON.parse(stored) as StoredEncryptedData);
          } catch (e) {
            console.warn('Failed to parse stored conversation:', key);
          }
        }
      }
    }
    
    return conversations.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  } catch (error) {
    console.error('❌ Failed to list stored conversations:', error);
    return [];
  }
}

/**
 * Delete stored encrypted conversation
 */
export function deleteEncryptedConversation(sessionId: string): void {
  try {
    const key = `psychat_encrypted_${sessionId}`;
    localStorage.removeItem(key);
    console.log('✅ Encrypted conversation deleted:', sessionId);
  } catch (error) {
    console.error('❌ Failed to delete encrypted conversation:', error);
  }
}
