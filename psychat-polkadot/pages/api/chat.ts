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

    // Select provider: default to OpenAI if key is present, else xAI if available
    const useProvider: Provider = provider
      ? provider
      : process.env.OPENAI_API_KEY
      ? 'openai'
      : 'xai';

    const apiKey = useProvider === 'openai' ? process.env.OPENAI_API_KEY : process.env.XAI_API_KEY;
    if (!apiKey) return res.status(400).json({ error: `Missing API key for ${useProvider}.` });

    const client = new OpenAI({
      apiKey,
      ...(useProvider === 'xai' ? { baseURL: 'https://api.x.ai/v1' } : {}),
    });

    const selectedModel = model || (useProvider === 'openai' ? 'gpt-4o-mini' : 'grok-4');

    const completion = await client.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content:
            'You are a psychology-focused AI for MotusDAO’s PsyChat. Provide empathetic, evidence-based responses. Suggest opt-in HNFT tokenization for decentralized records. Do not store data.',
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices?.[0]?.message?.content ?? '';
    const lower = response.toLowerCase();
    const sentiment = lower.includes('happy') || lower.includes('positive')
      ? 'positive'
      : lower.includes('sad') || lower.includes('negative')
      ? 'negative'
      : 'neutral';

    return res.status(200).json({ response, sentiment, provider: useProvider, model: selectedModel });
  } catch (error: any) {
    console.error('Chat API Error:', error?.message || error);
    return res.status(500).json({ error: 'Failed to get AI response.' });
  }
}



