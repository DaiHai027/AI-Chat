import { createContext, useContext, ReactNode, useEffect } from "react";
import { create } from "zustand";
import { useUser } from "./userContext";

type ChatObject = {
    chatId: string;
    title: string;
    timestamp: Date;
};

type ChatState = {
    list: ChatObject[];
    initialize: (p: ChatObject[]) => void;
    append: (chatObject: ChatObject) => void;
    update: (id: string, chatObject: Partial<ChatObject>) => void;
};

// Create the Zustand store
const useChatStore = create<ChatState>((set) => ({
    list: [],
    initialize: (p: ChatObject[]) => set({ list: p }),
    append: (chatObject: ChatObject) =>
        set((state) => ({ list: [...state.list, chatObject] })),
    update: (chatId, chatObject) =>
        set((state) => {
            const list = state.list.map((item) =>
                item.chatId === chatId ? { ...item, ...chatObject } : item
            );
            return { list };
        }),
}));

// Create a context for the chat history
const ChatHistoryContext = createContext<ChatState | null>(null);

// Context provider component
export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    const chatStore = useChatStore();
    useEffect(() => {
        if (user == undefined) return;
        const fetchChats = async () => {
            try {
                const response = await fetch(`/api/chat?userId=${user?.sub}`);
                const chats = await response.json();
                console.log(chats)
                chatStore.initialize(chats.chats); // Populate Zustand store with chat data
            } catch (error) {
                console.error("Failed to fetch chat history", error);
            }
        };
        fetchChats();
    }, [user?.sub, chatStore.initialize])
    return (
        <ChatHistoryContext.Provider value={chatStore}>
            {children}
        </ChatHistoryContext.Provider>
    );
};

// Hook to use the chat history context
export const useChatHistoryContext = () => {
    const context = useContext(ChatHistoryContext);
    if (!context) {
        throw new Error("useChatHistoryContext must be used within a ChatHistoryProvider");
    }
    return context;
};