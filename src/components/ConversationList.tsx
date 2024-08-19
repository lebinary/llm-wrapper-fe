import React from 'react';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId: number | undefined;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-transparent overflow-hidden">
      <h2 className="text-xl font-bold p-4 bg-gray-100 border-b border-gray-300">Previous Conversations</h2>
      <ul className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`cursor-pointer transition-colors duration-150 ease-in-out ${
              conversation.id === selectedConversationId
                ? 'bg-blue-50 hover:bg-blue-100'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                {conversation.title}
              </h3>
            </div>
          </li>
        ))}
      </ul>
      {conversations.length === 0 && (
        <p className="text-center text-gray-500 py-4">No conversations yet</p>
      )}
    </div>
  );
};
