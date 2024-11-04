'use client'
import { ChatsHistory } from "@/components/chats/chats-history";
import { ChatHistoryProvider } from "@/contexts/chatHistoryContext";
import React, { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";

const Layout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <ChatHistoryProvider>
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
                    {children}
                </div>

                {/* Overlay (appears when the drawer is open on mobile) */}
                {isDrawerOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 md:hidden"
                        onClick={() => setIsDrawerOpen(false)}
                    ></div>
                )}
            </div>
        </ChatHistoryProvider>
    );
}

export default Layout;