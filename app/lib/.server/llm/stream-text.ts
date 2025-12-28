import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getAPIKey, getGoogleAPIKey } from '~/lib/.server/llm/api-key';
import { getAnthropicModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';
import { GoogleGenAI } from '@google/genai';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export type AIProvider = 'anthropic' | 'google';

export async function streamText(
  messages: Messages,
  env: Env,
  provider: AIProvider = 'anthropic',
  options?: StreamingOptions,
) {
  if (provider === 'google') {
    // server-side Google GenAI SDK implementation
    const apiKey = getGoogleAPIKey(env);
    const ai = new GoogleGenAI({ apiKey });

    // convert messages to Google format
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // use streaming API - returns AsyncGenerator directly
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        maxOutputTokens: MAX_TOKENS,
        systemInstruction: getSystemPrompt(),
      },
    });

    let fullText = '';

    // create AI SDK compatible stream
    return {
      toAIStream: () => {
        const encoder = new TextEncoder();

        return new ReadableStream({
          async start(controller) {
            try {
              // iterate over the AsyncGenerator directly
              for await (const chunk of stream) {
                const text = chunk.text;

                if (text) {
                  fullText += text;
                  controller.enqueue(encoder.encode(`0:"${text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`));
                }
              }

              // close the stream naturally - client will detect completion
              controller.close();

              // trigger onFinish callback if provided
              if (options?.onFinish) {
                await options.onFinish({
                  text: fullText,
                  finishReason: 'stop',
                  usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                } as any);
              }
            } catch (error) {
              console.error('Google streaming error:', error);
              controller.error(error);
            }
          },
        });
      },
    };
  }

  // use Anthropic with AI SDK
  const model = getAnthropicModel(getAPIKey(env));

  return _streamText({
    model,
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
