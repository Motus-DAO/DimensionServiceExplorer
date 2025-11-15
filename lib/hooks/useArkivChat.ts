import { useArkiv } from '../../contexts/ArkivContext';

type Role = 'user' | 'assistant';

export function useArkivChat(polkadotAddress: string | null) {
  const { ensureChatBase, deriveChatBaseKey, mutateEntities, queryEntities, createEntity } = useArkiv();
  const enc = new TextEncoder();

  const ensureBase = async () => {
    if (!polkadotAddress) return '';
    return ensureChatBase(polkadotAddress);
  };

  const storeMessage = async (sessionId: string, role: Role, text: string) => {
    if (!polkadotAddress) return { entityKey: '' };
    const baseKey = deriveChatBaseKey(polkadotAddress);
    const attributes = [
      { key: 'type', value: 'chatMessage' },
      { key: 'polkadotAddress', value: polkadotAddress },
      { key: 'chatBaseKey', value: baseKey },
      { key: 'sessionId', value: sessionId },
      { key: 'role', value: role },
    ];
    return createEntity({ payload: enc.encode(text), contentType: 'text/plain', attributes, expiresIn: 600 });
  };

  const storeSession = async (params: { sessionId: string; start: number; end: number; messageCount: number; storageCid?: string; encrypted?: boolean }) => {
    if (!polkadotAddress) return { receipts: [] };
    const baseKey = deriveChatBaseKey(polkadotAddress);
    const attributes = [
      { key: 'type', value: 'chatSession' },
      { key: 'polkadotAddress', value: polkadotAddress },
      { key: 'chatBaseKey', value: baseKey },
      { key: 'sessionId', value: params.sessionId },
      { key: 'messageCount', value: String(params.messageCount) },
      { key: 'start', value: String(params.start) },
      { key: 'end', value: String(params.end) },
      { key: 'storageCid', value: params.storageCid || '' },
      { key: 'encrypted', value: params.encrypted ? 'true' : 'false' },
      { key: 'version', value: '1' },
    ];
    return mutateEntities({ creates: [{ payload: enc.encode('Chat Session'), contentType: 'text/plain', attributes, expiresIn: 200 }] });
  };

  const getSessions = async () => {
    if (!polkadotAddress) return { entities: [] };
    return queryEntities([
      { key: 'type', value: 'chatSession' },
      { key: 'polkadotAddress', value: polkadotAddress },
    ]);
  };

  const getMessagesForSession = async (sessionId: string) => {
    if (!polkadotAddress) return { entities: [] };
    return queryEntities([
      { key: 'type', value: 'chatMessage' },
      { key: 'polkadotAddress', value: polkadotAddress },
      { key: 'sessionId', value: sessionId },
    ]);
  };

  return { ensureBase, storeMessage, storeSession, getSessions, getMessagesForSession };
}
