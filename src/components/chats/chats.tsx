"use client";
import { useState } from "react";
import { Loadingbar } from "../loadingbar/loading-bar";
import { ScrollArea } from "../ui/scroll-area";
import { ChatsHistory } from "./chats-history";
import { RiAttachment2, RiDeleteBin5Line } from "react-icons/ri";
import { useChat } from "ai/react";
import { Markdown } from "../Markdown";
import clsx from "clsx";
import * as React from "react";
import { Transition } from "@headlessui/react";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useParams, useRouter } from "next/navigation";
import { IoMdLogIn } from "react-icons/io";
import { FaArrowCircleRight } from 'react-icons/fa'; // Importing an arrow icon (e.g., from react-icons)


//------------------------------
const Textarea = ({ onChange, input }: any) => {
  return (
    <>
      {/* component */}
      <div className="mx-auto flex flex-1  items-center rounded-full bg-white px-3 py-2 shadow-md focus:outline-none">
        <span className="flex" data-state="closed">
          <span>
            <button
              aria-disabled="false"
              aria-label="Attach files"
              className="text-token-text-primary flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-black dark:text-white dark:focus-visible:outline-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </span>
        </span>
        <input
          type="text"
          placeholder="Type your message..."
          className="max flex-1 rounded-full bg-white px-3 py-1 focus:outline-none"
          value={input ?? ""}
          onChange={onChange}
        />
        {/* <button className="ml-3 rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Send
        </button> */}
        <button
          type="submit"
          aria-label="Send prompt"
          data-testid="send-button"
          className="disabled:dark:bg-token-text-quaternary dark:disabled:text-token-main-surface-secondary flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:bg-[#D7D7D7] disabled:text-[#f4f4f4] disabled:hover:opacity-100 dark:bg-white dark:text-black dark:focus-visible:outline-white"
        >
          <svg
            width={32}
            height={32}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="icon-2xl"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

//------------------------------
const Message = React.forwardRef<HTMLDivElement, {
  role: string;
  content: string;
  isStreaming: boolean;
  scrollToCardNum: number;
  scrollToRef: any;
} > (
  (
    {
      scrollToCardNum,
      role,
      content,
      isStreaming,
      scrollToRef,
    },
    ref
  )  => {
    return (
      <div id="chat-editor" className="mb-5" ref={ref}>
        <div
          className={`grid grid-cols-9 gap-2 ${role === "user" ? "text-green-600" : ""
            }`}
        >
          {(role !== "user" && role !== "system") && (
            <div className="font- font-inter  uppercase">
              <img
                alt="User"
                width={35}
                height={35}
                className="rounded-full"
                referrerPolicy="no-referrer"
                src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?size=338&ext=jpg&ga=GA1.1.1023967583.1729468800&semt=ais_hybrid"
              />
            </div>
          )}
          {
            role !== 'system' && (
              <div
                className={clsx(
                  "font-inter col-start-2 col-end-9 w-full  bg-white px-4 py-2",
                  role === "user"
                    ? "w-3/5 rounded-3xl rounded-br  border-green-600"
                    : "rounded-3xl  rounded-bl-md",
                )}
              >
                {isStreaming && (
                  <Loadingbar
                    color={role == "user" ? "bg-green-700" : "bg-gray-600"}
                  />
                )}
                <div className={clsx("font-inter w-full pl-2 pr-0")}>
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            )
          }
          {role === "user" && (
            <div className="font- font-inter col-span-1 ml-5 uppercase">
              <img
                alt="User"
                width={32}
                height={32}
                className="rounded-full"
                referrerPolicy="no-referrer"
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);
Message.displayName = 'Message';


export const ChatThread = () => {
  const params = useParams();
  const update = useChatHistory((s) => s.update);
  const [title, setTitle] = React.useState<string>();
  const chatContainerRef = React.useRef<any>(null);
  const scrollToRef = React.useRef<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const [user, setUser] = React.useState<any | null>(null);

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    setUser(storedUser);
  }, []);

  const { handleInputChange, handleSubmit, messages, input, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          role: 'system',
          content: 'You are a medical chronology assistant for injury law cases.',
          id: "0"
        },
        {
          id: "1",
          role: 'assistant',
          content: 'Hi, How can I help you today?',
        }
      ]
    });

  React.useEffect(() => {
    let title;
    if (messages.length === 3) {
      title = messages[2]?.content.split(" ").slice(0, 4).join(" ");
      setTitle(title);
      update(params.chat as string, {
        messages: messages.length,
        title: title ?? "untitled",
      });
    } else if (messages.length > 4) {
      params.chat &&
        update(params.chat as string, { messages: messages.length });
    }
  }, [messages.length]);
  const scrollToCardNum = messages.length - 1;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  React.useEffect(() => {
    const scrollableDiv: any = document.getElementById("chat-editor");
    scrollableDiv?.scrollTo({
      top: scrollableDiv.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col gap-1 p-4">
      <div className="sticky right-0 top-0 w-full border-b bg-white px-4 pb-2 pt-3">
        <div className="relative mb-2 w-full flex-row-between">
          <span className="font-inter text-xs font-bold uppercase ">
            conversation
          </span>
          <div className="flex items-center gap-2 pr-1 leading-[0]">
            <button
              data-testid="profile-button"
              className="hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-0"
              type="button"
              id="radix-:rak:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
              style={{
                display: "var(--screen-size-hidden-on-compact-mode, flex)",
              }}
            >
              <div className="  flex items-center justify-center overflow-hidden rounded-full">
                <div className=" flex">
                  <img
                    onClick={() => setIsOpen(!isOpen)}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-sm"
                    referrerPolicy="no-referrer"
                    src={user?.picture}
                  />
                  {isOpen && (
                    <div className="p-x-5 absolute right-0 top-11  z-50 w-52 rounded-md bg-[#103a44] py-2 text-white">
                      <div className="flex cursor-pointer items-center gap-2 p-2 ">
                        {user?.name}
                      </div>
                      <div className="flex cursor-pointer items-center mt-2 gap-2 p-2 ">
                        {user?.email}
                      </div>
                      <div
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                          router.push("/");
                        }}
                        className="flex cursor-pointer items-center gap-2 p-2 mt-5 "
                      >
                        {" "}
                        <IoMdLogIn size={20} />
                        Sign Out
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className=""></div>
      </div>
      <div
        id="chat-editor"
        className="mx-auto flex h-full  w-full max-w-4xl items-center justify-center overflow-y-auto scrollbar-hide"
      >
        <div className="flex h-full w-full flex-col">
          <div className="mx-auto flex-1">
            <ScrollArea className="flex w-full grow items-center justify-center px-4 pt-2">
              <div className="h-full w-full ">

                {messages.map((item: any, i: number) => (
                  <div key={i}>
                    <Message
                      role={item.role}
                      content={item.content}
                      isStreaming={i === messages.length - 1 && isLoading}
                      scrollToCardNum={scrollToCardNum} // Set this to the index of the last message.
                      scrollToRef={scrollToRef}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            {messages.length === 0 && (
              <div className="sticky bottom-0 w-full h-full flex py-5 justify-center items-center">
                <div className="w-full justify-center text-center">
                  <div className="relative inline-flex justify-center text-center text-2xl font-semibold leading-9">
                    <h1>What can I help with?</h1>
                    <h1
                      className="result-streaming absolute left-full transition-opacity"
                      style={{ opacity: 0 }}
                    >
                      <span />
                    </h1>
                  </div>
                </div>
              </div>

            )}
          </div>
          <div className="sticky bottom-0 w-full max-w-5xl bg-[#F5F5F5] md:py-10 xs:py-4">
            <form onSubmit={handleSubmit} className="w-full">
              <Textarea onChange={handleInputChange} input={input} />
            </form>
            {/* <div className="mt-5 flex  w-full flex-nowrap items-center justify-center gap-x-2 opacity-100 transition-opacity xl:gap-x-2.5">
              <ul className="relative flex flex-nowrap items-stretch justify-start gap-x-2 gap-y-4 overflow-hidden py-2 sm:gap-y-2 xl:gap-x-2.5 xl:gap-y-2.5">
                <li
                  style={{ opacity: 1, willChange: "auto", transform: "none" }}
                >
                  <button className="border-token-border-light shadow-xxs enabled:hover:bg-token-main-surface-secondary relative flex h-[42px] items-center gap-1.5 rounded-full border px-3 py-2 text-start text-[13px] transition disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-md"
                      style={{ color: "rgb(53, 174, 71)" }}
                    >
                      <path
                        d="M4.5 17.5L7.56881 14.3817C8.32655 13.6117 9.55878 13.5826 10.352 14.316L16.5 20"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 12H18.3798C17.504 12 16.672 11.6173 16.102 10.9524L11.898 6.04763C11.328 5.38269 10.496 5 9.6202 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V17"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 5H18.3798C17.504 5 16.672 5.38269 16.102 6.04763L14 8.5"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
                      <path
                        d="M18 14V10C18 9.58798 18.4704 9.35279 18.8 9.6L21.4667 11.6C21.7333 11.8 21.7333 12.2 21.4667 12.4L18.8 14.4C18.4704 14.6472 18 14.412 18 14Z"
                        fill="currentColor"
                      />
                      <path
                        d="M18 7V3C18 2.58798 18.4704 2.35279 18.8 2.6L21.4667 4.6C21.7333 4.8 21.7333 5.2 21.4667 5.4L18.8 7.4C18.4704 7.64721 18 7.41202 18 7Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="max-w-full whitespace-nowrap text-gray-600 dark:text-gray-500">
                      Create image
                    </span>
                  </button>
                </li>
                <li
                  style={{ opacity: 1, willChange: "auto", transform: "none" }}
                >
                  <button className="border-token-border-light shadow-xxs enabled:hover:bg-token-main-surface-secondary relative flex h-[42px] items-center gap-1.5 rounded-full border px-3 py-2 text-start text-[13px] transition disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]">
                    <svg
                      width={26}
                      height={24}
                      viewBox="0 0 26 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-md"
                      style={{ color: "rgb(118, 208, 235)" }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.4544 4.10451C13.1689 3.95886 12.8309 3.95886 12.5455 4.10451L2.98609 8.98175L2.07715 7.20022L11.6365 2.32298C12.493 1.88603 13.5069 1.88603 14.3634 2.32298L23.9227 7.20022C24.7332 7.61373 25.091 8.44008 24.9999 9.2194V15C24.9999 15.5523 24.5522 16 23.9999 16C23.4477 16 22.9999 15.5523 22.9999 15V11.2156L20.9666 12.2115V16.3052C20.9666 17.409 20.3605 18.4237 19.3885 18.9468L14.4219 21.6203C13.5341 22.0981 12.4657 22.0981 11.578 21.6203L6.61135 18.9468C5.63941 18.4237 5.03328 17.409 5.03328 16.3052V12.2115L2.10635 10.7779C0.626202 10.0529 0.609039 7.94926 2.07715 7.20022L2.98608 8.98175L12.5601 13.671C12.8376 13.807 13.1623 13.807 13.4398 13.671L23 8.9885C23.0001 8.98394 23.0001 8.97938 23.0003 8.97483L13.4544 4.10451ZM7.03328 13.1911V16.3052C7.03328 16.6732 7.23532 17.0114 7.5593 17.1858L12.526 19.8592C12.8219 20.0185 13.178 20.0185 13.4739 19.8592L18.4406 17.1858C18.7646 17.0114 18.9666 16.6732 18.9666 16.3052V13.1911L14.3195 15.4672C13.4871 15.8749 12.5128 15.8749 11.6803 15.4672L7.03328 13.1911Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="max-w-full whitespace-nowrap text-gray-600 dark:text-gray-500">
                      Get advice
                    </span>
                  </button>
                </li>
                <li
                  style={{ opacity: 1, willChange: "auto", transform: "none" }}
                >
                  <button className="border-token-border-light shadow-xxs enabled:hover:bg-token-main-surface-secondary relative flex h-[42px] items-center gap-1.5 rounded-full border px-3 py-2 text-start text-[13px] transition disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-md"
                      style={{ color: "rgb(234, 132, 68)" }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4 5C4 3.34315 5.34315 2 7 2H14.1716C14.9672 2 15.7303 2.31607 16.2929 2.87868L19.1213 5.70711C19.6839 6.26972 20 7.03278 20 7.82843V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V5ZM7 4C6.44772 4 6 4.44772 6 5V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7.82843C18 7.56321 17.8946 7.30886 17.7071 7.12132L14.8787 4.29289C14.6911 4.10536 14.4368 4 14.1716 4H7ZM8 10C8 9.44772 8.44772 9 9 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H9C8.44772 11 8 10.5523 8 10ZM8 14C8 13.4477 8.44772 13 9 13H13C13.5523 13 14 13.4477 14 14C14 14.5523 13.5523 15 13 15H9C8.44772 15 8 14.5523 8 14Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="max-w-full whitespace-nowrap text-gray-600 dark:text-gray-500">
                      Summarize text
                    </span>
                  </button>
                </li>
                <li
                  style={{ opacity: 1, willChange: "auto", transform: "none" }}
                >
                  <button className="border-token-border-light shadow-xxs enabled:hover:bg-token-main-surface-secondary relative flex h-[42px] items-center gap-1.5 rounded-full border px-3 py-2 text-start text-[13px] transition disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-md"
                      style={{ color: "rgb(203, 139, 208)" }}
                    >
                      <path
                        d="M3 6H10"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 10H7"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                      <path
                        d="M13.4282 17.5718L20.5 10.5C21.6046 9.39543 21.6046 7.60457 20.5 6.5C19.3954 5.39543 17.6046 5.39543 16.5 6.5L9.42819 13.5718C9.14899 13.851 8.95868 14.2066 8.88124 14.5938L8 19L12.4062 18.1188C12.7934 18.0413 13.149 17.851 13.4282 17.5718Z"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="max-w-full whitespace-nowrap text-gray-600 dark:text-gray-500">
                      Help me write
                    </span>
                  </button>
                </li>
                <li
                  style={{ opacity: 1, willChange: "auto", transform: "none" }}
                >
                  <button className="border-token-border-light shadow-xxs enabled:hover:bg-token-main-surface-secondary relative flex h-[42px] items-center gap-1.5 rounded-full border px-3 py-2 text-start text-[13px] transition disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-md"
                      style={{ color: "rgb(226, 197, 65)" }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 3C8.41496 3 5.5 5.92254 5.5 9.53846C5.5 11.8211 6.662 13.8298 8.42476 15H15.5752C17.338 13.8298 18.5 11.8211 18.5 9.53846C18.5 5.92254 15.585 3 12 3ZM14.8653 17H9.13473V18H14.8653V17ZM13.7324 20H10.2676C10.6134 20.5978 11.2597 21 12 21C12.7403 21 13.3866 20.5978 13.7324 20ZM8.12601 20C8.57004 21.7252 10.1361 23 12 23C13.8639 23 15.43 21.7252 15.874 20C16.4223 19.9953 16.8653 19.5494 16.8653 19V16.5407C19.0622 14.9976 20.5 12.4362 20.5 9.53846C20.5 4.82763 16.6992 1 12 1C7.30076 1 3.5 4.82763 3.5 9.53846C3.5 12.4362 4.93784 14.9976 7.13473 16.5407V19C7.13473 19.5494 7.57774 19.9953 8.12601 20Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="max-w-full whitespace-nowrap text-gray-600 dark:text-gray-500">
                      Brainstorm
                    </span>
                  </button>
                </li>
              </ul>
              <div
                className="inline-block"
                style={{ opacity: 1, willChange: "auto", transform: "none" }}
              >
                <button className="border-token-border-light shadow-xxs enabled:hover:bg-token-main-surface-secondary relative flex h-[42px] items-center gap-1.5 rounded-full border px-3 py-2 text-start text-[13px] transition disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]">
                  <span className="max-w-full whitespace-nowrap text-gray-600 dark:text-gray-500">
                    More
                  </span>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Chats = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative flex max-h-screen w-full overflow-hidden h-screen">
      {/* Toggle Button (Visible on mobile only) */}
      {!isDrawerOpen && (
        <button
          className="absolute z-50 top-[50%] left-2 p-3 rounded-full bg-gray-100 text-gray-600 hover:text-blue-500 hover:bg-gray-200 shadow-md transition-all transform hover:scale-110 md:hidden"
          style={{ transform: 'translateY(-50%)' }} // Centers button vertically
          onClick={() => setIsDrawerOpen(true)}
        >
          <FaArrowCircleRight size={24} /> {/* Icon size slightly increased */}
        </button>
      )}

      {/* Drawer for ChatsHistory */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-lg transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:block`}
      >
        <ChatsHistory />
      </div>

      {/* Main Chat Thread */}
      <div className="w-full flex-1 overflow-hidden">
        <ChatThread />
      </div>

      {/* Overlay (appears when the drawer is open on mobile) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}
    </div>
  );
};