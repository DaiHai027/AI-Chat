"use client";
import { useState } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { IoMdLogIn } from "react-icons/io";
import { useUser } from "@/contexts/userContext";
import { useChatHistoryContext } from "@/contexts/chatHistoryContext";

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
          value={input}
          onChange={onChange}
        />
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


const ChatPage = () => {
  const {append} = useChatHistoryContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (input.trim()) {
      try {
        // Send the message to /api/chat
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input, userId: user?.sub }),
        });

        // Clear input after sending
        setInput("");

        if (response.ok) {
          const { chatId, title, timestamp } = await response.json();
          append({
            chatId,
            title,
            timestamp: timestamp,
          });
          // Redirect to /chat/[chatId]
          router.push(`/chat/${chatId}`);
        } else {
          console.error("Failed to send message.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

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
      </div>
      <div
        id="chat-editor"
        className="mx-auto flex h-full  w-full max-w-4xl items-center justify-center overflow-y-auto scrollbar-hide"
      >
        <div className="flex h-full w-full flex-col">
          <div className="mx-auto flex-1">
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
          </div>
          <div className="sticky bottom-0 w-full max-w-5xl bg-[#F5F5F5] md:py-10 xs:py-4">
            <form className="w-full" onSubmit={handleSubmit}>
              <Textarea input = {input} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;