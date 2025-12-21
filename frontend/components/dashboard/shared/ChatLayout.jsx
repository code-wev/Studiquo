"use client";

import {
  useGetGroupsQuery,
  useGetMessagesQuery,
} from "@/feature/shared/ChatApi";
import { connectSocket, getSocket } from "@/lib/socket";
import { parseJwt } from "@/middleware";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiSearch, FiSend } from "react-icons/fi";

export default function ChatInterface() {
  const token = Cookies.get("token");
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [page, setPage] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [localMessages, setLocalMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const jwtPayload = parseJwt(token);
  const currentUserId = jwtPayload?.sub;
  const currentUserRole = jwtPayload?.role;

  console.log("Current user ID:", currentUserId);
  console.log("Current user role:", currentUserRole);

  const { data: groupsResponse } = useGetGroupsQuery(undefined, {
    skip: !token,
  });
  const groups = groupsResponse || [];

  console.log("Groups:", groups);

  const messagesQuery = useGetMessagesQuery(
    selectedGroup ? { groupId: selectedGroup._id, page, limit: 40 } : null,
    { skip: !selectedGroup }
  );

  console.log("Messages Query:", messagesQuery);

  // Get appropriate avatar for the group based on current user role
  const getGroupAvatar = (group) => {
    if (currentUserRole === "Student" || currentUserRole === "Parent") {
      return (
        group.tutor?.avatar ||
        `https://ui-avatars.com/api/?name=${group.tutor?.firstName}+${group.tutor?.lastName}&background=7C3AED&color=fff`
      );
    } else if (currentUserRole === "Tutor") {
      return (
        group.student?.avatar ||
        `https://ui-avatars.com/api/?name=${group.student?.firstName}+${group.student?.lastName}&background=7C3AED&color=fff`
      );
    }
    return `https://ui-avatars.com/api/?name=${group.subject}&background=7C3AED&color=fff`;
  };

  // Get appropriate name for the group based on current user role
  const getGroupName = (group) => {
    if (currentUserRole === "Student" || currentUserRole === "Parent") {
      return `${group.tutor?.firstName} ${group.tutor?.lastName}`;
    } else if (currentUserRole === "Tutor") {
      return `${group.student?.firstName} ${group.student?.lastName}`;
    }
    return group.subject;
  };

  // Get last message or status text
  const getGroupSubtitle = (group) => {
    if (currentUserRole === "Student" || currentUserRole === "Parent") {
      return "Tutor";
    } else if (currentUserRole === "Tutor") {
      return "Student";
    }
    return "Chat";
  };

  // Initialize messages when selectedGroup changes or new data comes in
  useEffect(() => {
    if (messagesQuery.data && selectedGroup) {
      const newMessages = messagesQuery.data.data || messagesQuery.data || [];

      if (page === 1) {
        setLocalMessages(newMessages);
      } else {
        setLocalMessages((prev) => [...newMessages, ...prev]);
      }
      setHasMore(newMessages.length >= 40);
    }
  }, [messagesQuery.data, selectedGroup, page]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Handle infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !messagesQuery.isLoading) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, messagesQuery.isLoading]);

  useEffect(() => {
    if (!token) return;

    const s = connectSocket();
    s.on("connect", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });
    s.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    s.on("newMessage", (msg) => {
      console.log("New message via socket:", msg);
      if (
        !(selectedGroup && String(msg.chatGroup) === String(selectedGroup._id))
      )
        return;

      setLocalMessages((prev) => {
        const pendingIndex = prev.findIndex(
          (m) => m.pending && String(m.content) === String(msg.content)
        );
        if (pendingIndex !== -1) {
          const copy = [...prev];
          copy[pendingIndex] = msg;
          return copy;
        }
        return [...prev, msg];
      });
    });

    s.on("userTyping", ({ userId, isTyping }) => {
      console.log("User typing:", userId, isTyping);
      setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
    });

    if (selectedGroup) {
      s.emit("joinRoom", selectedGroup._id);
    }

    return () => {
      try {
        s.off("connect");
        s.off("disconnect");
        s.off("newMessage");
        s.off("userTyping");
        s.disconnect();
      } catch (e) {
        console.error("Socket cleanup error:", e);
      }
    };
  }, [token, selectedGroup]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleSend() {
    if (!selectedGroup || !messageText?.trim()) return;
    const content = messageText.trim();
    const temp = {
      _id: `temp-${Date.now()}`,
      chatGroup: selectedGroup._id,
      senderId: currentUserId || "me",
      content,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setLocalMessages((prev) => [...prev, temp]);
    setMessageText("");

    try {
      const s = getSocket();
      s?.emit("sendMessage", { room: selectedGroup._id, message: content });
    } catch (err) {
      console.error("Error emitting message:", err);
    }
  }

  function handleTypingChange(e) {
    const value = e.target.value;
    setMessageText(value);

    const s = getSocket();
    if (!s || !selectedGroup) return;

    s.emit("typing", {
      room: selectedGroup._id,
      isTyping: !!value.trim(),
    });
  }

  // Format date for display
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to get sender display info
  const getSenderInfo = (msg) => {
    const sender =
      msg.sender && typeof msg.sender === "object"
        ? msg.sender
        : msg.senderId
        ? { _id: msg.senderId }
        : null;

    const firstName = sender?.firstName || "";
    const lastName = sender?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const initials = fullName ? fullName.charAt(0).toUpperCase() : "U";

    return {
      avatar: sender?.avatar,
      initials,
    };
  };

  return (
    <div className='flex bg-gray-50 border-t border-gray-200 h-screen'>
      {/* Sidebar */}
      <div className='w-80 bg-[#EFEBF5] border-r border-gray-200 flex flex-col'>
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-purple-700 mb-4'>
            Messages
          </h2>
          <div className='relative'>
            <FiSearch className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search chats...'
              className='w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
        </div>

        <div className='flex-1 overflow-auto'>
          {groups?.length ? (
            groups.map((group) => {
              const avatarUrl = getGroupAvatar(group);
              const groupName = getGroupName(group);
              const groupSubtitle = getGroupSubtitle(group);

              return (
                <div
                  key={group._id}
                  onClick={() => {
                    console.log("Selecting group:", group);
                    setSelectedGroup(group);
                    setPage(1);
                    setLocalMessages([]);
                    const s = getSocket();
                    try {
                      s?.emit("joinRoom", { room: group._id });
                    } catch (e) {}
                  }}
                  className={`p-4 cursor-pointer border-b border-gray-200 hover:bg-white transition-colors ${
                    selectedGroup?._id === group._id
                      ? "bg-white border-l-4 border-l-purple-600"
                      : ""
                  }`}>
                  <div className='flex items-center gap-3'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500'>
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={groupName}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `
                                <span class="text-white font-bold text-lg">
                                  ${group.subject?.[0] || groupName?.[0] || "C"}
                                </span>
                              `;
                            }}
                          />
                        ) : (
                          <span className='text-white font-bold text-lg'>
                            {group.subject?.[0] || groupName?.[0] || "C"}
                          </span>
                        )}
                      </div>
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold truncate'>{groupName}</h3>
                      <p className='text-sm text-gray-500 truncate'>
                        {groupSubtitle} • {group.subject}
                      </p>
                      <p className='text-xs text-gray-400 mt-1'>
                        Starts: {new Date(group.startsAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='p-4 text-sm text-gray-500'>No chats yet</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col h-full'>
        {/* Header */}
        {selectedGroup ? (
          <div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500'>
                  {selectedGroup.tutor?.avatar ||
                  selectedGroup.student?.avatar ? (
                    <img
                      src={
                        selectedGroup.tutor?.avatar ||
                        selectedGroup.student?.avatar
                      }
                      alt={selectedGroup.subject}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <span class="text-white font-bold">
                            ${selectedGroup.subject?.[0] || "C"}
                          </span>
                        `;
                      }}
                    />
                  ) : (
                    <span className='text-white font-bold'>
                      {selectedGroup.subject?.[0] || "C"}
                    </span>
                  )}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    socketConnected ? "bg-green-500" : "bg-gray-400"
                  }`}></div>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>
                  {getGroupName(selectedGroup)} • {selectedGroup.subject}
                </h3>
                <div className='flex items-center gap-2'>
                  <p
                    className={`text-sm ${
                      socketConnected ? "text-green-600" : "text-gray-500"
                    }`}>
                    {socketConnected ? "Online" : "Connecting..."}
                  </p>
                  {Object.keys(typingUsers).filter((k) => typingUsers[k])
                    .length > 0 && (
                    <span className='text-xs text-purple-600 animate-pulse'>
                      • Typing...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-white border-b border-gray-200 px-6 py-4'>
            <h3 className='font-semibold text-gray-500'>
              Select a chat to start messaging
            </h3>
          </div>
        )}

        {/* Messages Container */}
        <div
          ref={containerRef}
          className='flex-1 overflow-y-auto bg-gray-50 p-6'>
          {messagesQuery.isLoading && page === 1 ? (
            <div className='flex justify-center items-center h-full'>
              <div className='text-gray-500'>Loading messages...</div>
            </div>
          ) : localMessages.length > 0 ? (
            <div className='space-y-4'>
              {hasMore && !messagesQuery.isLoading && (
                <div className='text-center py-2'>
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className='text-sm text-purple-600 hover:text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-50'>
                    Load older messages
                  </button>
                </div>
              )}
              {messagesQuery.isLoading && page > 1 && (
                <div className='text-center py-2 text-gray-500'>
                  Loading older messages...
                </div>
              )}

              {localMessages.map((msg) => {
                const msgSenderId =
                  (msg.sender && (msg.sender._id || msg.sender.id)) ||
                  msg.senderId ||
                  (typeof msg.sender === "string" ? msg.sender : undefined);

                const isOwnMessage =
                  String(msgSenderId) === String(currentUserId);

                const { avatar, initials } = getSenderInfo(msg);

                return (
                  <div
                    key={msg._id || msg.content}
                    className={`flex items-end gap-2 ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}>
                    {/* Avatar */}
                    <div className='w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500'>
                      {avatar ? (
                        <img
                          src={avatar}
                          alt='sender'
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.querySelector(
                              "span"
                            ).style.display = "flex";
                          }}
                        />
                      ) : null}
                      <span
                        className={`text-white font-bold text-sm ${
                          avatar ? "hidden" : "flex"
                        } items-center justify-center w-full h-full`}>
                        {initials}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[70%]`}>
                      <div
                        className={`px-4 py-3 rounded-2xl break-words ${
                          isOwnMessage
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}>
                        {typeof msg.content === "string"
                          ? msg.content
                          : JSON.stringify(msg.content)}
                      </div>
                      <div
                        className={`text-xs text-gray-500 mt-1 px-1 ${
                          isOwnMessage ? "text-right" : "text-left"
                        }`}>
                        {msg.createdAt
                          ? formatMessageTime(msg.createdAt)
                          : "Just now"}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : selectedGroup ? (
            <div className='flex flex-col justify-center items-center h-full text-gray-500'>
              <div className='text-lg mb-2'>No messages yet</div>
              <div className='text-sm'>Start the conversation!</div>
            </div>
          ) : (
            <div className='flex justify-center items-center h-full text-gray-500'>
              Select a chat to view messages
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedGroup && (
          <div className='bg-white border-t border-gray-200 p-4'>
            <div className='flex items-center gap-3'>
              <button className='p-2 hover:bg-gray-100 rounded-full'>
                <CiCirclePlus className='text-3xl text-purple-500/70 hover:text-purple-600' />
              </button>
              <input
                value={messageText}
                onChange={handleTypingChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                type='text'
                placeholder='Type your message...'
                className='flex-1 px-5 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className={`p-3 rounded-full transition-all ${
                  messageText.trim()
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}>
                <FiSend className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
