import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';
import { useSocket } from '../hooks/useSocket';

export interface IMessage {
    _id: string;
    from: string;
    id: string;
    timestamp: string;
    text: {
        body: string;
    };
    type: string;
    wa_id: string;
    name: string;
    status: 'sent' | 'delivered' | 'read';
}

export interface IConversation {
    wa_id: string;
    name: string;
    lastMessage: string;
    lastMessageTimestamp: string;
}

interface ChatContextType {
    conversations: IConversation[];
    messages: IMessage[];
    selectedConversation: IConversation | null;
    loading: boolean;
    selectConversation: (conversation: IConversation | null) => void;
    sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();

    const fetchConversations = useCallback(async () => {
        try {
            const response = await apiService.get<IConversation[]>('/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    }, []);

    const fetchMessages = useCallback(async (wa_id: string) => {
        setLoading(true);
        try {
            const response = await apiService.get<IMessage[]>(`/conversations/${wa_id}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.wa_id);
        } else {
            setMessages([]);
        }
    }, [selectedConversation, fetchMessages]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: IMessage) => {
            setConversations(prev =>
                prev.map(c =>
                    c.wa_id === newMessage.wa_id
                        ? { ...c, lastMessage: newMessage.text.body, lastMessageTimestamp: newMessage.timestamp }
                        : c
                ).sort((a, b) => parseInt(b.lastMessageTimestamp) - parseInt(a.lastMessageTimestamp))
            );
            if (selectedConversation?.wa_id === newMessage.wa_id) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        const handleStatusUpdate = (update: { id: string; status: 'delivered' | 'read' }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === update.id ? { ...msg, status: update.status } : msg
                )
            );
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('messageStatusUpdate', handleStatusUpdate);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('messageStatusUpdate', handleStatusUpdate);
        };
    }, [socket, selectedConversation]);

    const selectConversation = (conversation: IConversation | null) => {
        setSelectedConversation(conversation);
    };

    const sendMessage = async (text: string) => {
        if (!selectedConversation) return;
        try {
            await apiService.post('/messages', {
                wa_id: selectedConversation.wa_id,
                name: selectedConversation.name,
                text: text,
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <ChatContext.Provider value={{ conversations, messages, selectedConversation, loading, selectConversation, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};