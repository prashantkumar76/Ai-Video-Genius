'use client';
import { useEffect, useState } from 'react';
import {  Video } from 'lucide-react';



export default function Loading() {
 const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    // Dynamic loading text for summary page
    const loadingMessages = [
      'Loading summary...',
      'Preparing your insights...',
      'Organizing content...',
      'Almost ready...'
    ];

    let messageIndex = 0;
    const textInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 750);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
      {/* Animated Background Elements - Same as other pages */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-ping duration-[3000ms]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-in fade-in duration-700">
        {/* Logo container with enhanced animations */}
        <div className="relative">
          {/* Outer rotating ring with gradient */}
          <div className="w-32 h-32 rounded-full animate-spin relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
            </div>
          </div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-3 w-24 h-24 rounded-full animate-spin animate-reverse border-2 border-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-border"></div>
          
          {/* Inner rotating elements */}
          <div className="absolute inset-6 w-16 h-16 rounded-full animate-pulse bg-gradient-to-r from-purple-400 to-pink-500"></div>
          
          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center animate-bounce hover:scale-110 transition-transform duration-300">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Loading text with enhanced styling */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
            Your AI Summary
          </h2>
          
          <div className="bg-black/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
            <p className="text-xl font-semibold text-white mb-2">
              {loadingText}
            </p>
            <div className="flex space-x-1 justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Progress bar */}
        <div className="w-80 space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Loading </span>
            <span>Please wait...</span>
          </div>
          <div className="h-2 bg-black/20 backdrop-blur-xl rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full animate-pulse origin-left transform animate-fill shadow-lg"></div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-6 text-gray-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Ready to Go</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            <span className="text-sm">Loading Content</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
            <span className="text-sm">Finalizing</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes fill {
          0% { transform: scaleX(0); }
          25% { transform: scaleX(0.3); }
          50% { transform: scaleX(0.6); }
          75% { transform: scaleX(0.8); }
          100% { transform: scaleX(1); }
        }
        .animate-reverse {
          animation: reverse 3s linear infinite;
        }
        .animate-fill {
          animation: fill 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
