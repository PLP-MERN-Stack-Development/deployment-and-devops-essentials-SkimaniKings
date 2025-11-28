import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Hash, Users, Circle, Search, LogOut } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { state, changeRoom } = useChat();
  const { activeRoomId, users, currentUser } = state;
  const [searchTerm, setSearchTerm] = useState('');

  const rooms = [
    { id: 'general', name: 'General', type: 'public' },
    { id: 'tech', name: 'Tech Talk', type: 'public' },
    { id: 'random', name: 'Random', type: 'public' },
  ];

  const filteredUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 
        bg-gradient-to-b from-slate-900/70 to-slate-900/30
        backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col h-full shadow-xl
      `}
    >

      {/* Header */}
      <div className="p-4 bg-slate-900/60 border-b border-white/10 shadow-md flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          ChatIO
        </h2>
        <button onClick={onClose} className="md:hidden text-slate-300 hover:text-white">
          &times;
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 bg-slate-900/40 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <img
            src={currentUser?.avatar}
            alt="Me"
            className="w-10 h-10 rounded-full border border-white/20 shadow"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.username}
            </p>
            <div className="flex items-center text-xs text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-slate-300">

        {/* Rooms */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1 text-slate-400">
            <Hash className="w-3 h-3" /> Rooms
          </h3>

          <div className="space-y-1">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => {
                  changeRoom(room.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`
                  w-full flex items-center px-3 py-2 text-sm rounded-lg 
                  transition-all duration-150
                  ${
                    activeRoomId === room.id
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-400/20'
                      : 'text-slate-300 hover:bg-white/10'
                  }
                `}
              >
                <Hash className="w-4 h-4 mr-3 text-slate-400" />
                {room.name}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1 text-slate-400">
            <Users className="w-3 h-3" /> Direct Messages
          </h3>

          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search users..."
              className="
                w-full pl-8 pr-3 py-2 text-xs rounded-md 
                bg-slate-800/60 border border-white/10 
                text-slate-200 placeholder-slate-400
                focus:ring-1 focus:ring-blue-500/50 outline-none
              "
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
          </div>

          <div className="space-y-1">
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => {
                  changeRoom(user.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`
                  w-full flex items-center px-3 py-2 text-sm rounded-lg 
                  transition-all duration-150
                  ${
                    activeRoomId === user.id
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-400/20'
                      : 'text-slate-300 hover:bg-white/10'
                  }
                `}
              >
                <div className="relative mr-3">
                  <img
                    src={user.avatar}
                    className="w-6 h-6 rounded-full"
                    alt=""
                  />
                  <span
                    className={`
                      absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 
                      border-slate-900 rounded-full 
                      ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}
                    `}
                  ></span>
                </div>
                {user.username}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-900/40">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
