import { useParams } from "next/navigation";
import * as React from "react";
import { IoMdAdd } from "react-icons/io";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { useChatHistoryContext } from "@/contexts/chatHistoryContext";
import { useRouter } from "next/navigation";
import { isToday, isWithinInterval, subWeeks, subMonths } from 'date-fns';

type ChatObject = {
  chatId: string;
  title: string;
  timestamp: Date;
};

type ThreadLinkProp = {
  title: string;
  // date: Date;
  isCurrent: boolean;
  id: string;
};

type GroupedChats = {
  today: ChatObject[];
  pastWeek: ChatObject[];
  pastMonth: ChatObject[];
  earlier: ChatObject[];
};

const ThreadLink = ({ title, id, /*date,*/ isCurrent }: ThreadLinkProp) => {
  return (
    <Link href={`/chat/${id}`}>
      <div className={`no-draggable group relative mx-3 truncate rounded-lg ${isCurrent ? "bg-[#055160] text-white" : "text-[#ffffffa8]"} hover:bg-[#055160] hover:text-white active:opacity-90`}>
        <div className="flex items-center gap-2 p-2">
          <div className="relative grow overflow-hidden whitespace-nowrap text-sm capitalize" dir="auto">
            {title}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ChatsHistory = () => {
  const params = useParams();
  const { list } = useChatHistoryContext();
  const router = useRouter();

  // Reverse the list to show oldest first
  const reversedList = [...list].reverse();

  // Group chats by time periods
  const groupedChats: GroupedChats = {
    today: [],
    pastWeek: [],
    pastMonth: [],
    earlier: [],
  };

  const now = new Date();

  reversedList.forEach(chat => {
    const chatDate = new Date(chat.timestamp);

    if (isToday(chatDate)) {
      groupedChats.today.push(chat);
    } else if (isWithinInterval(chatDate, { start: subWeeks(now, 1), end: now })) {
      groupedChats.pastWeek.push(chat);
    } else if (isWithinInterval(chatDate, { start: subMonths(now, 1), end: now })) {
      groupedChats.pastMonth.push(chat);
    } else {
      groupedChats.earlier.push(chat);
    }
  });

  return (
    <div className="relative border-r bg-[#103a44] ">
      <div className="sticky top-0 z-[2] flex flex-col space-y-2 p-2 pb-3">
        <div className="md:h-header-height flex h-[60px] items-center justify-between">
          <span className="flex" data-state="closed">
            <div className="text-2xl text-white ml-5 font-bold">AI</div>
          </span>
          <div className="flex">
            <span className="flex" data-state="closed">
              <button
                onClick={() => {
                  router.push("/chat");
                }}
                aria-label="New chat"
                data-testid="create-new-chat-button"
                className="text-token-text-secondary disabled:text-token-text-quaternary focus-visible:bg-token-sidebar-surface-secondary h-10 rounded-lg px-2 text-[#ffffffa8] hover:text-white focus-visible:outline-0 bg-[#055160]"
              >
                <IoMdAdd size={22} />
              </button>
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="scrollbar-hide h-[89vh] space-y-1 overflow-y-auto">
        {/* Render Today */}
        {groupedChats.today.length > 0 && (
          <>
            <h3 className="px-2 pb-2 pt-3 text-xs font-semibold text-[#ffffffa8]">Today</h3>
            {groupedChats.today.map((o) => (
              <ThreadLink
                id={o.chatId}
                key={o.chatId}
                // date={o.timestamp}
                title={o.title}
                isCurrent={o.chatId == (params?.chatId)}
              />
            ))}
          </>
        )}

        {/* Render Previous Week */}
        {groupedChats.pastWeek.length > 0 && (
          <>
            <h3 className="px-2 pb-2 pt-3 text-xs font-semibold text-[#ffffffa8]">Previous 1 Week</h3>
            {groupedChats.pastWeek.map((o) => (
              <ThreadLink
                id={o.chatId}
                key={o.chatId}
                // date={o.timestamp}
                title={o.title}
                isCurrent={o.chatId == (params?.chatId)}
              />
            ))}
          </>
        )}

        {/* Render Previous Month */}
        {groupedChats.pastMonth.length > 0 && (
          <>
            <h3 className="px-2 pb-2 pt-3 text-xs font-semibold text-[#ffffffa8]">Previous 1 Month</h3>
            {groupedChats.pastMonth.map((o) => (
              <ThreadLink
                id={o.chatId}
                key={o.chatId}
                // date={o.timestamp}
                title={o.title}
                isCurrent={o.chatId == (params?.chatId)}
              />
            ))}
          </>
        )}

        {/* Render Earlier Chats */}
        {groupedChats.earlier.length > 0 && (
          <>
            <h3 className="px-2 pb-2 pt-3 text-xs font-semibold text-[#ffffffa8]">Earlier</h3>
            {groupedChats.earlier.map((o) => (
              <ThreadLink
                id={o.chatId}
                key={o.chatId}
                // date={o.timestamp}
                title={o.title}
                isCurrent={o.chatId == (params?.chatId)}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
};