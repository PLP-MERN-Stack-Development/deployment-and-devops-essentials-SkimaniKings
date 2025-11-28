import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import type { Message } from '../types';
import CallModal from './CallModal';

const ChatWindow: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { state, sendMessage, sendTyping, startCall } = useChat();
  const { messages, activeRoomId, typingUsers, currentUser, users } = state;
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeUser = users.find(u => u.id === activeRoomId);
  const chatTitle = activeUser ? activeUser.username : `# ${activeRoomId}`;
  const isDM = !!activeUser;

  const currentMessages = messages.filter(msg => {
    if (['general', 'tech', 'random'].includes(activeRoomId)) {
        return msg.roomId === activeRoomId;
    } else {
        return (msg.senderId === currentUser?.id && msg.roomId === activeRoomId) ||
               (msg.senderId === activeRoomId && msg.roomId === currentUser?.id);
    }
  });

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => scrollToBottom(), [currentMessages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      sendTyping();
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
    setIsTyping(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      sendMessage(`Shared a file: ${file.name}`, 'image', url);
    }
  };

  const handleCall = (video: boolean) => {
    if (isDM) startCall(video);
    else alert("Group calling is not available in public rooms yet.");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 relative">
      <CallModal />

      {/* Header */}
      <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 
        flex justify-between items-center 
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-md 
        shadow-sm sticky top-0 z-10">

        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h2 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
              {chatTitle}
              {['general', 'tech', 'random'].includes(activeRoomId) && (
                <span className="px-2 py-0.5 text-xs rounded-full border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                  Public
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {activeUser ? (activeUser.status === 'online' ? 'Active now' : 'Last seen recently') : `${users.length} members online`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
          <button
            onClick={() => handleCall(false)}
            disabled={!isDM}
            className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition ${!isDM && 'opacity-40 cursor-not-allowed'}`}
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleCall(true)}
            disabled={!isDM}
            className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition ${!isDM && 'opacity-40 cursor-not-allowed'}`}
          >
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 
        bg-gray-50 dark:bg-slate-950/40">

        {currentMessages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser?.id;
          const showAvatar = !isMe && (idx === 0 || currentMessages[idx - 1].senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
              {!isMe && (
                <div className="w-8 mr-2 flex-shrink-0">
                  {showAvatar && (
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderName}`}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-700 shadow-sm"
                      alt={msg.senderName}
                    />
                  )}
                </div>
              )}

              <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && showAvatar && (
                  <span className="text-xs text-gray-500 ml-1 mb-1">{msg.senderName}</span>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl shadow 
                    text-sm break-words transition-all duration-200
                    ${isMe
                      ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                    }`}
                >
                  {/* FILE */}
                  {msg.type === 'image' && msg.fileUrl && (
                    <div className="mb-2">
                      <img src={msg.fileUrl} alt="shared" className="rounded-lg max-h-64 object-cover shadow" />
                    </div>
                  )}

                  {msg.text}

                  <span className={`text-[10px] block text-right mt-1 opacity-70 
                    ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 ml-12">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>{typingUsers.join(', ')} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto">

          <div className="flex-1 relative 
            bg-gray-100 dark:bg-slate-800 rounded-2xl 
            border border-transparent 
            focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 
            transition-all">

            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Message ${isDM ? chatTitle : '#' + activeRoomId}...`}
              className="w-full bg-transparent border-none px-4 py-3 pr-14 text-sm 
                focus:ring-0 text-gray-800 dark:text-white"
            />

            <div className="absolute right-3 bottom-2 flex items-center gap-1 text-gray-400">
              <label className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <Paperclip className="w-4 h-4" />
              </label>
              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 
              disabled:opacity-50 disabled:cursor-not-allowed 
              text-white rounded-xl shadow-lg hover:shadow-blue-500/30 
              transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>

        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
