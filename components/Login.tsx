import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { MessageSquare } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
        <div
          className="w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm transform transition-all"
          aria-hidden={false}
        >
          {/* Animated card wrapper */}
          <div className="login-card p-8 rounded-2xl bg-white/6 dark:bg-black/30 border border-white/5 shadow-xl">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent shadow-inner">
                <MessageSquare className="w-14 h-14 text-blue-400" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2 tracking-tight">
              Let’s get you chatting
            </h1>

            <p className="text-sm md:text-base text-center text-slate-300 mb-8">
              Choose a username and jump into the conversation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-200 mb-2"
                >
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 placeholder-slate-400 text-white border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition-all"
                  placeholder="e.g. JohnDoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] transition-transform duration-200 text-white font-semibold shadow-lg shadow-indigo-700/30"
              >
                <span>Enter Chat</span>
                <svg
                  className="w-5 h-5 -mr-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Scoped CSS for animations (styling only) */}
      <style>{`
        /* Entrance + float animation for the card */
        .login-card {
          opacity: 0;
          transform: translateY(18px) rotate(-0.6deg) scale(0.995);
          animation:
            slideUpFade 520ms cubic-bezier(.2,.9,.27,1) forwards,
            floatY 6s ease-in-out 900ms infinite;
        }

        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(18px) rotate(-0.6deg) scale(0.995);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(-6px) rotate(0.3deg) scale(1.002);
            filter: blur(0.6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes floatY {
          0%   { transform: translateY(0) rotate(0); }
          25%  { transform: translateY(-6px) rotate(0.2deg); }
          50%  { transform: translateY(0) rotate(0); }
          75%  { transform: translateY(6px) rotate(-0.2deg); }
          100% { transform: translateY(0) rotate(0); }
        }

        /* Reduce motion preference: disable float for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .login-card { animation: slideUpFade 520ms cubic-bezier(.2,.9,.27,1) forwards; }
        }
      `}</style>
    </>
  );
};

export default Login;
