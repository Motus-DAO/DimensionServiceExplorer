import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
type Provider = 'openai' | 'xai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, provider, model } = req.body as {
      messages: ChatMessage[];
      provider?: Provider;
      model?: string;
    };

    if (!Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages' });

    // Prefer xAI Grok for the assistant unless explicitly overridden
    const useProvider: Provider = provider
      ? provider
      : process.env.XAI_API_KEY
      ? 'xai'
      : 'openai';

    const apiKey = useProvider === 'openai' ? process.env.OPENAI_API_KEY : process.env.XAI_API_KEY;
    if (!apiKey) return res.status(400).json({ error: `Missing API key for ${useProvider}.` });

    const client = new OpenAI({
      apiKey,
      ...(useProvider === 'xai' ? { baseURL: 'https://api.x.ai/v1' } : {}),
    });

    const selectedModel = model || (useProvider === 'xai' ? 'grok-4' : 'gpt-4o-mini');

    const completion = await client.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content:
            'You are PsyChat\'s on-site AI Assistant. Help users navigate the MotusDAO/PsyChat app, explain features, and perform on-chain and off-chain actions via simple prompts. Keep answers concise and actionable. When transactions are requested, outline the steps you will take and ask for confirmation. Do not store any personal data. This assistant chat is not encrypted.',
        },
        ...messages,
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const response = completion.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ response, provider: useProvider, model: selectedModel });
  } catch (error: any) {
    console.error('Assistant API Error:', error?.message || error);
    return res.status(500).json({ error: 'Failed to get assistant response.' });
  }
}


