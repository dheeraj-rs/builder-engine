'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { atom } from 'nanostores';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import { workbenchStore } from '~/lib/stores/workbench';
import { getMessages, getNextId, getUrlId, openDatabase, setMessages } from './db';

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

const persistenceEnabled = !process.env.NEXT_PUBLIC_DISABLE_PERSISTENCE;

let dbInstance: IDBDatabase | undefined;
let dbPromise: Promise<IDBDatabase | undefined> | undefined;

async function initDB() {
  if (dbInstance) return dbInstance;
  if (dbPromise) return dbPromise;

  if (!persistenceEnabled) return undefined;

  dbPromise = openDatabase().then((db) => {
    dbInstance = db;
    return db;
  });

  return dbPromise;
}

// Export db for backward compatibility with Menu.client.tsx
export async function getDB() {
  return initDB();
}

export const chatId = atom<string | undefined>(undefined);
export const description = atom<string | undefined>(undefined);

export function useChatHistory() {
  const router = useRouter();
  const params = useParams();
  const mixedId = params?.id as string | undefined;

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [urlId, setUrlId] = useState<string | undefined>();

  useEffect(() => {
    async function loadHistory() {
      const db = await initDB();

      if (!db) {
        setReady(true);
        if (persistenceEnabled) {
          toast.error(`Chat persistence is unavailable`);
        }
        return;
      }

      if (mixedId) {
        try {
          const storedMessages = await getMessages(db, mixedId);

          if (storedMessages && storedMessages.messages.length > 0) {
            setInitialMessages(storedMessages.messages);
            setUrlId(storedMessages.urlId);
            description.set(storedMessages.description);
            chatId.set(storedMessages.id);
          } else {
            router.replace('/');
          }

          setReady(true);
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    }

    loadHistory();
  }, [mixedId, router]);

  return {
    ready: !mixedId || ready,
    initialMessages,
    storeMessageHistory: async (messages: Message[]) => {
      const db = await initDB();

      if (!db || messages.length === 0) {
        return;
      }

      const { firstArtifact } = workbenchStore;

      if (!urlId && firstArtifact?.id) {
        const newUrlId = await getUrlId(db, firstArtifact.id);
        navigateChat(newUrlId);
        setUrlId(newUrlId);
      }

      if (!description.get() && firstArtifact?.title) {
        description.set(firstArtifact?.title);
      }

      if (initialMessages.length === 0 && !chatId.get()) {
        const nextId = await getNextId(db);
        chatId.set(nextId);

        if (!urlId) {
          navigateChat(nextId);
        }
      }

      await setMessages(db, chatId.get() as string, messages, urlId, description.get());
    },
  };
}

function navigateChat(nextId: string) {
  const url = new URL(window.location.href);
  url.pathname = `/chat/${nextId}`;
  window.history.replaceState({}, '', url);
}
