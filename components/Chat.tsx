import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './Button';
import { Send, MessageSquare } from 'lucide-react';

interface ChatProps {
  rideId: string;
}

export const Chat: React.FC<ChatProps> = ({ rideId }) => {
  const { currentUser, chatMessages, sendMessage } = useApp();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = chatMessages.filter(m => m.rideId === rideId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !currentUser) return;
    sendMessage(rideId, currentUser.id, currentUser.fullName, text);
    setText('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 p-3 flex items-center space-x-2 border-b border-gray-700">
        <MessageSquare className="w-5 h-5 text-yellow-500" />
        <span className="font-semibold text-white">Ride Chat</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center text-sm mt-4">No messages yet. Say hello!</p>
        )}
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p className="text-xs font-bold mb-1 opacity-75">{msg.senderName}</p>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-gray-800 border-t border-gray-700 flex space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-900 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
        />
        <Button onClick={handleSend} className="!px-3 !py-2">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};