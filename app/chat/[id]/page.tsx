import { BaseChat } from '~/components/chat/BaseChat';
import { Header } from '~/components/header/Header';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const DynamicChat = dynamic(
    () => import('~/components/chat/Chat.client').then(mod => ({ default: mod.Chat })),
    {
        ssr: false,
        loading: () => <BaseChat />
    }
);

export const metadata: Metadata = {
    title: 'D Admin',
    description: 'Talk with D Admin, your AI assistant'
};

export default function ChatPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex flex-col h-full w-full">
            <Header />
            <DynamicChat />
        </div>
    );
}
