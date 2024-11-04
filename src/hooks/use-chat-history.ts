import { create } from "zustand";

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

export const useChatHistory = create<ChatState>((set) => ({
    list: [],
    append: (p: ChatObject) => set((state) => ({ list: [...state.list, p] })),
    update: (chatId, chatObject) =>
        set((state) => {
            if (state.list.length === 0) {
                return {
                    list: [{ ...chatObject, timestamp: new Date(), chatId }],
                } as ChatState;
            } else {
        const list = state.list.map((item) => {
            if (item.chatId === chatId) {
                return { ...item, ...chatObject };
            }
            return item;
        });
        return {
              list,
          };
      }
    }),
    initialize: (p: ChatObject[]) => set({ list: p }),
}));
