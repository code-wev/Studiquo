"use client";

import { FiSearch, FiSend } from "react-icons/fi";

const messages = [
  { sender: "tutor", text: "Hi Elmer, did you understand the lesson?" },
  { sender: "student", text: "omg, this is amazing" },
  { sender: "student", text: "perfect! ✅" },
  { sender: "student", text: "Wow, this is really epic" },
  { sender: "student", text: "just ideas for next time" },
  { sender: "student", text: "I'll be there in 2 mins ❤️" },
  { sender: "tutor", text: "How are you?" },
  { sender: "tutor", text: "woohoooo" },
  { sender: "tutor", text: "Haha oh man" },
  { sender: "tutor", text: "Haha that's terrifying 😂" },
  { sender: "student", text: "aww" },
  { sender: "student", text: "omg, this is amazing" },
  { sender: "student", text: "woohoooo 🔥" },
];

export default function ChatInterface() {
  return (
    <div className='flex bg-gray-50 border-t border-gray-200'>
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
              placeholder='Search customer ...'
              className='w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
        </div>

        <div className='flex-1'>
          {/* Chat List */}
          {/* Selected */}
          <div className='p-4 cursor-pointer bg-white border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                  E
                </div>
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
              <div>
                <h3 className='font-semibold'>Elmer Laverty</h3>
                <p className='text-sm text-gray-500'>Online</p>
              </div>
            </div>
          </div>
          {/* Other Chats */}
          <div className='p-4 cursor-pointer bg-transparent hover:bg-white border-b border-gray-200 transition'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                  E
                </div>
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
              <div>
                <h3 className='font-semibold'>Elmer Laverty</h3>
                <p className='text-sm text-gray-500'>Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 h-[93.7vh] flex flex-col'>
        {/* Header */}
        <div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4'>
          <div className='relative'>
            <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold'>
              E
            </div>
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
          </div>
          <div>
            <h3 className='font-semibold'>Elmer Laverty</h3>
            <p className='text-sm text-green-600'>Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "tutor" ? "justify-end" : "justify-start"
              }`}>
              <div className='flex items-end gap-3 max-w-md'>
                {/* Student messages: avatar on left */}
                {msg.sender === "student" && (
                  <div className='mb-1 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0'>
                    E
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-xs break-words ${
                    msg.sender === "tutor"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 shadow-sm rounded-tl-none"
                  }`}>
                  {msg.text}
                </div>

                {/* Tutor messages: avatar on right */}
                {msg.sender === "tutor" && (
                  <div className='mb-1 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0' />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='bg-white border-t border-gray-200 p-4'>
          <div className='flex items-center gap-4'>
            <input
              type='text'
              placeholder='Type your message'
              className='flex-1 px-5 py-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
            <button className='p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors'>
              <FiSend className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
