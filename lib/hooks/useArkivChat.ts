import { useArkiv } from '../../contexts/ArkivContext';
import { stringToPayload } from '@arkiv-network/sdk/utils';

type Role = 'user' | 'assistant';

export function useArkivChat(polkadotAddress: string | null) {
  const { ensureChatBase, deriveChatBaseKey, mutateEntities, queryEntities, createEntity } = useArkiv();

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
    return createEntity({ payload: stringToPayload(text), contentType: 'text/plain', attributes, expiresIn: 600 });
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
    return mutateEntities({ creates: [{ payload: stringToPayload('Chat Session'), contentType: 'text/plain', attributes, expiresIn: 200 }] });
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

  // Store XX Network DM identity in Arkiv
  const storeXXIdentity = async (xxDmIdentityBase64: string) => {
    if (!polkadotAddress) return { entityKey: '' };
    const baseKey = deriveChatBaseKey(polkadotAddress);
    const attributes = [
      { key: 'type', value: 'xxIdentity' },
      { key: 'polkadotAddress', value: polkadotAddress },
      { key: 'chatBaseKey', value: baseKey },
    ];
    return createEntity({ payload: stringToPayload(xxDmIdentityBase64), contentType: 'text/plain', attributes, expiresIn: 365 * 24 * 3600 });
  };

  // Get XX Network DM identity from Arkiv
  const getXXIdentity = async (): Promise<string | null> => {
    if (!polkadotAddress) return null;
    const result = await queryEntities([
      { key: 'type', value: 'xxIdentity' },
      { key: 'polkadotAddress', value: polkadotAddress },
    ]);
    if (result.entities.length === 0) return null;
    const entity = result.entities[0];
    const payload = entity.payload || entity.payloadBase64;
    if (typeof payload === 'string') {
      try {
        return Buffer.from(payload, 'base64').toString('utf-8');
      } catch {
        return payload;
      }
    } else if (payload instanceof Uint8Array) {
      return new TextDecoder().decode(payload);
    }
    return null;
  };

  return { ensureBase, storeMessage, storeSession, getSessions, getMessagesForSession, storeXXIdentity, getXXIdentity };
}
